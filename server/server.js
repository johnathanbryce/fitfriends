const admin = require('firebase-admin');
const cron = require('node-cron');
const serviceAccount = require('../serviceAccountKey.json'); 

// Initialize Firebase Admin SDK using the loaded service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fit-friends-2ce27-default-rtdb.firebaseio.com',
});

const express = require('express');
const app = express();

const port = 4001; // NOTE this port for testing

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// TODO: challenge ties
// function to update challenge status to "inactive" if the current date is past the end date
const checkAndUpdateChallengeStatus = async (challengeId) => {
    console.log('checkAndUpdate')
    try {
      const db = admin.database();
      const challengeRef = db.ref(`challenges/${challengeId}`);
      const challengeSnapshot = await challengeRef.once('value');
      const challengeData = challengeSnapshot.val();
  
      const currentTime = Date.now();
      const challengeEnds = new Date(challengeData.challengeDuration.ends);
  
      if (currentTime >= challengeEnds && challengeData.status !== 'inactive') {
        await challengeRef.update({ status: 'inactive' });
        // determines and updates the challenge winner
        determineAndSetChallengeWinner(challengeId);
      }
    } catch (error) {
      console.error('Error checking/updating challenge status:', error);
    }
  };

// TODO: add logic to deal with ties
const determineAndSetChallengeWinner = async (challengeId) => {
  console.log('determineAndSet');
  try {
    const db = admin.database();
    const challengeRef = db.ref(`challenges/${challengeId}`);
    const participantsSnapshot = await challengeRef.child('participants').once('value');
    const participants = participantsSnapshot.val();
    const challengeDataSnapshot = await challengeRef.once('value');
    const challengeData = challengeDataSnapshot.val();

    let highestTotalPoints = -1;
    let winnerId = '';

    // loop through participants to find the winner
    for (const participantId in participants) {
      const participant = participants[participantId];
      if (participant.totalPoints > highestTotalPoints) {
        highestTotalPoints = participant.totalPoints;
        winnerId = participantId;
      }
    }

    if (winnerId) {
      // Update the challenge winner and username directly using challengeRef
      await challengeRef.update({
        challengeWinner: winnerId,
        challengeWinnerUsername: participants[winnerId].username,
      });

      // Increase challengesWon for the challenge winner
      const winnerUserRef = db.ref(`users/${winnerId}`);
      const winnerUserSnapshot = await winnerUserRef.once('value');
      const winnerUserData = winnerUserSnapshot.val();

      console.log('winner user data', winnerUserData)
      // Ensure the user exists and has challengesWon property
      if (winnerUserData) {
        console.log('inside if statement')
        await winnerUserRef.update({
          challengesWon: /* (winnerUserData.challengesWon || 0) */ + 1,
        });
      }
    }

    // Decrease challengesCreatedLimit for the challenge creator
    const creatorUid = challengeData.creator; 
    if (creatorUid) {
      const creatorUserRef = db.ref(`users/${creatorUid}`);
      const creatorUserSnapshot = await creatorUserRef.once('value');
      const creatorUserData = creatorUserSnapshot.val();

      // Ensure the user exists and has challengesCreatedLimit property
      if (creatorUserData && creatorUserData.challengesCreatedLimit) {
        await creatorUserRef.update({
          challengesCreatedLimit: creatorUserData.challengesCreatedLimit - 1,
        });
      }
    }
  } catch (error) {
    console.error('Error determining/setting challenge winner:', error);
  }
};



  
// schedule the function to run every minute 
cron.schedule('* * * * *', () => { // runs every 1 minute
    console.log('Running challenge status check...');
    const db = admin.database();
    const challengesRef = db.ref('challenges');

    challengesRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
        const challengeId = childSnapshot.key;
        checkAndUpdateChallengeStatus(challengeId);
        });
    });
});

  
  
  