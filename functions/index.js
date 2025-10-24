const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const {logger} = require("firebase-functions");

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Checks if a challenge has passed its end date and updates status to inactive.
 * Also triggers winner determination when a challenge ends.
 *
 * @param {string} challengeId - The ID of the challenge to check
 * @return {Promise<void>}
 */
const checkAndUpdateChallengeStatus = async (challengeId) => {
  try {
    const db = admin.database();
    const challengeRef = db.ref(`challenges/${challengeId}`);
    const challengeSnapshot = await challengeRef.once("value");

    if (!challengeSnapshot.exists()) {
      logger.warn(`Challenge ${challengeId} does not exist`);
      return;
    }

    const challengeData = challengeSnapshot.val();

    // Skip if already inactive
    if (challengeData.status === "inactive") {
      return;
    }

    const currentTime = Date.now();
    const challengeEnds = new Date(challengeData.challengeDuration.ends);

    // Check if challenge has ended
    if (currentTime >= challengeEnds.getTime()) {
      logger.info(`Challenge ${challengeId} has ended. Marking as inactive.`);

      await challengeRef.update({status: "inactive"});

      // Determine and set the winner
      await determineAndSetChallengeWinner(challengeId);
    }
  } catch (error) {
    logger.error(
        `Error checking/updating challenge status for ${challengeId}:`,
        error,
    );
  }
};

/**
 * Determines the winner of a challenge and updates relevant user stats.
 * Handles tie scenarios by selecting the first participant alphabetically.
 *
 * @param {string} challengeId - The ID of the challenge
 * @return {Promise<void>}
 */
const determineAndSetChallengeWinner = async (challengeId) => {
  try {
    const db = admin.database();
    const challengeRef = db.ref(`challenges/${challengeId}`);
    const participantsSnapshot = await challengeRef
        .child("participants")
        .once("value");
    const participants = participantsSnapshot.val();

    if (!participants || Object.keys(participants).length === 0) {
      logger.warn(`Challenge ${challengeId} has no participants`);
      return;
    }

    const challengeDataSnapshot = await challengeRef.once("value");
    const challengeData = challengeDataSnapshot.val();

    let highestTotalPoints = -1;
    const winners = []; // Track potential ties

    // Loop through participants to find the winner(s)
    for (const participantId in participants) {
      if (!Object.prototype.hasOwnProperty.call(participants, participantId)) {
        continue;
      }

      const participant = participants[participantId];
      const totalPoints = participant.totalPoints || 0;

      if (totalPoints > highestTotalPoints) {
        // New high score - clear previous winners and set new winner
        highestTotalPoints = totalPoints;
        winners.length = 0;
        winners.push({
          id: participantId,
          username: participant.username,
          totalPoints: totalPoints,
        });
      } else if (totalPoints === highestTotalPoints && highestTotalPoints > 0) {
        // Tie detected - add to winners array
        winners.push({
          id: participantId,
          username: participant.username,
          totalPoints: totalPoints,
        });
      }
    }

    if (winners.length === 0 || highestTotalPoints <= 0) {
      logger.warn(
          `Challenge ${challengeId} has no valid winner (no points scored)`,
      );
      await challengeRef.update({
        challengeWinner: null,
        challengeWinnerUsername: "No winner",
      });
      return;
    }

    let finalWinner = winners[0];

    // Handle tie-breaking: select first alphabetically by username
    if (winners.length > 1) {
      logger.info(
          `Tie detected for challenge ${challengeId}: ${winners.length} ` +
        `participants with ${highestTotalPoints} points`,
      );

      winners.sort((a, b) => a.username.localeCompare(b.username));
      finalWinner = winners[0];

      logger.info(
          `Tie broken alphabetically. Winner: ${finalWinner.username}`,
      );
    }

    // Update challenge with winner information
    await challengeRef.update({
      challengeWinner: finalWinner.id,
      challengeWinnerUsername: finalWinner.username,
      challengeWinnerPoints: finalWinner.totalPoints,
      ...(winners.length > 1 && {
        tiedParticipants: winners.map((w) => ({
          id: w.id,
          username: w.username,
          totalPoints: w.totalPoints,
        })),
      }),
    });

    logger.info(
        `Challenge ${challengeId} winner set: ${finalWinner.username} ` +
      `with ${finalWinner.totalPoints} points`,
    );

    // Update winner's challengesWon count (FIX: properly increment)
    const winnerUserRef = db.ref(`users/${finalWinner.id}`);
    const winnerUserSnapshot = await winnerUserRef.once("value");
    const winnerUserData = winnerUserSnapshot.val();

    if (winnerUserData) {
      const currentChallengesWon = winnerUserData.challengesWon || 0;
      await winnerUserRef.update({
        challengesWon: currentChallengesWon + 1,
      });
      logger.info(
          `Updated challengesWon for ${finalWinner.username}: ` +
        `${currentChallengesWon} -> ${currentChallengesWon + 1}`,
      );
    } else {
      logger.error(`Winner user ${finalWinner.id} not found in database`);
    }

    // Decrease challengesCreatedLimit for the challenge creator
    const creatorUid = challengeData.creator;
    if (creatorUid) {
      const creatorUserRef = db.ref(`users/${creatorUid}`);
      const creatorUserSnapshot = await creatorUserRef.once("value");
      const creatorUserData = creatorUserSnapshot.val();

      if (creatorUserData && creatorUserData.challengesCreatedLimit > 0) {
        const newLimit = creatorUserData.challengesCreatedLimit - 1;
        await creatorUserRef.update({
          challengesCreatedLimit: newLimit,
        });
        logger.info(
            `Decreased challengesCreatedLimit for creator ${creatorUid}: ` +
          `${creatorUserData.challengesCreatedLimit} -> ${newLimit}`,
        );
      } else if (!creatorUserData) {
        logger.error(`Creator user ${creatorUid} not found in database`);
      }
    }
  } catch (error) {
    logger.error(
        `Error determining/setting challenge winner for ${challengeId}:`,
        error,
    );
  }
};

/**
 * Scheduled function that runs every 5 minutes to check and update
 * challenge statuses. Only processes challenges with "active" status
 * for efficiency.
 *
 * Schedule: Every 5 minutes
 * Timezone: America/Toronto (adjust as needed)
 */
exports.checkChallengeStatus = onSchedule(
    {
      schedule: "*/5 * * * *", // Every 5 minutes
      timeZone: "America/Toronto", // Adjust to your timezone
      memory: "256MiB",
      timeoutSeconds: 540, // 9 minutes (max for scheduled functions)
    },
    async (event) => {
      logger.info("Starting scheduled challenge status check...");

      try {
        const db = admin.database();
        const challengesRef = db.ref("challenges");

        // OPTIMIZATION: Only query active challenges
        const snapshot = await challengesRef
            .orderByChild("status")
            .equalTo("active")
            .once("value");

        if (!snapshot.exists()) {
          logger.info("No active challenges found");
          return null;
        }

        const challenges = snapshot.val();
        const challengeIds = Object.keys(challenges);

        logger.info(`Found ${challengeIds.length} active challenges to check`);

        // Process challenges sequentially to avoid overwhelming the database
        for (const challengeId of challengeIds) {
          await checkAndUpdateChallengeStatus(challengeId);
        }

        logger.info("Challenge status check completed successfully");
        return null;
      } catch (error) {
        logger.error("Error in scheduled challenge status check:", error);
        throw error; // Re-throw to mark function as failed
      }
    },
);

/**
 * MANUAL TRIGGER FUNCTION (for testing)
 * HTTP function to manually trigger challenge status check
 * Use this for testing: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/manualCheckChallenges
 *
 * Remove this function before production deployment or add authentication
 */
const {onRequest} = require("firebase-functions/v2/https");

exports.manualCheckChallenges = onRequest(async (req, res) => {
  logger.info("Manual challenge check triggered via HTTP");

  try {
    const db = admin.database();
    const challengesRef = db.ref("challenges");

    const snapshot = await challengesRef
        .orderByChild("status")
        .equalTo("active")
        .once("value");

    if (!snapshot.exists()) {
      res.json({success: true, message: "No active challenges found"});
      return;
    }

    const challenges = snapshot.val();
    const challengeIds = Object.keys(challenges);

    for (const challengeId of challengeIds) {
      await checkAndUpdateChallengeStatus(challengeId);
    }

    res.json({
      success: true,
      message: `Checked ${challengeIds.length} challenges`,
      challengeIds: challengeIds,
    });
  } catch (error) {
    logger.error("Error in manual challenge check:", error);
    res.status(500).json({success: false, error: error.message});
  }
});
