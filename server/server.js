const admin = require('firebase-admin');
require('dotenv').config(); // .env file
const cron = require('node-cron'); // Import node-cron

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  }),
  databaseURL: 'https://fit-friends-2ce27-default-rtdb.firebaseio.com',
});

const express = require('express');
const app = express();

const port = 4000; // NOTE this port for testing

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// function to update challenge status to "inactive" if the current date is past the end date
const checkAndUpdateChallengeStatus = async (challengeId) => {
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

// 
// function to determine and set the challenge winner
const determineAndSetChallengeWinner = async (challengeId) => {
try {
    const db = admin.database();
    const challengeRef = db.ref(`challenges/${challengeId}`);
    const participantsSnapshot = await challengeRef.child('participants').once('value');
    const participants = participantsSnapshot.val();

    // initializing it with -1 ensures that any value of totalPoints from a participant will be greater than -1
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
      await challengeRef.update({ challengeWinner: winnerId });
      console.log(`Challenge ${challengeId} winner is ${winnerId}.`);
    }
} catch (error) {
    console.error('Error determining/setting challenge winner:', error);
}
};
  
// schedule the function to run every minute 
cron.schedule('*/10 * * * *', () => { // runs every 10 minutes
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

  
  
  