const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Adds a new challenge to the Realtime Database.
 * @async
 * @function
 * @throws {Error} Throws an error if there's an issue adding the challenge.
 */
async function addNewChallenge() {
  const database = admin.database();

  // Generate a new challenge (you can replace this with your own logic)
  const newChallenge = {
    text: "This is a new challenge",
    timestamp: admin.database.ServerValue.TIMESTAMP,
  };

  // Push the new challenge to the "challenges" node in your database
  const challengesRef = database.ref("challenges");
  challengesRef.push(newChallenge);
}

// Create a scheduled function to run every 30 seconds
exports.scheduledFunction = functions.pubsub
    .schedule("*/30 * * * * *") // Run every 30 seconds
    .timeZone("America/Vancouver") // Set to Pacific Time Zone (PST)
    .onRun((context) => {
      addNewChallenge();
      return null;
    });

