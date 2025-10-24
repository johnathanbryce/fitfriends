# FitFriends Cloud Functions

This directory contains Firebase Cloud Functions for automated challenge management in the FitFriends application.

## Overview

The Cloud Functions replace the previous local cron server and provide serverless, scheduled task execution for:
- Automatically closing challenges when their end date is reached
- Determining and announcing challenge winners
- Updating user statistics (challenges won)
- Managing challenge creator limits

## Functions

### `checkChallengeStatus` (Scheduled)
**Schedule**: Every 5 minutes
**Timezone**: America/Toronto

Automatically checks all active challenges and:
1. Marks challenges as "inactive" when their end date has passed
2. Determines the winner based on highest total points
3. Handles tie scenarios (selects first alphabetically by username)
4. Updates winner's `challengesWon` counter
5. Decrements creator's `challengesCreatedLimit`

**Optimizations**:
- Only queries challenges with `status: "active"` (database efficiency)
- Processes challenges sequentially to avoid database overload
- Comprehensive error handling and logging

### `manualCheckChallenges` (HTTP Trigger)
**URL**: `https://[REGION]-fit-friends-2ce27.cloudfunctions.net/manualCheckChallenges`

Manual trigger for testing purposes. Executes the same logic as the scheduled function.

**Note**: Remove or add authentication before production deployment.

## Setup & Installation

### Prerequisites
- Node.js 22.0 or higher
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project access for `fit-friends-2ce27`

### Installation

1. **Navigate to functions directory**:
   ```bash
   cd functions
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Login to Firebase** (if not already logged in):
   ```bash
   firebase login
   ```

4. **Verify project configuration**:
   ```bash
   firebase use
   ```
   Should show: `fit-friends-2ce27`

## Local Testing

### Emulator Testing

1. **Start Firebase Emulators**:
   ```bash
   npm run serve
   ```

2. **Access Emulator UI**:
   Open http://localhost:4000 in your browser

3. **Manually trigger the function**:
   - Via Emulator UI: Navigate to Functions tab and trigger `checkChallengeStatus`
   - Via HTTP: `curl http://localhost:5001/fit-friends-2ce27/us-central1/manualCheckChallenges`

### Shell Testing

```bash
npm run shell
# Then in the shell:
> checkChallengeStatus({})
```

## Deployment

### Deploy All Functions

```bash
npm run deploy
```

Or from project root:
```bash
firebase deploy --only functions
```

### Deploy Specific Function

```bash
firebase deploy --only functions:checkChallengeStatus
```

### First Deployment Steps

1. **Install dependencies**:
   ```bash
   cd functions && npm install
   ```

2. **Set timezone** (if different from America/Toronto):
   Edit `index.js` and update the `timeZone` parameter in the `onSchedule` configuration.

3. **Deploy**:
   ```bash
   firebase deploy --only functions
   ```

4. **Verify deployment**:
   ```bash
   firebase functions:log
   ```

## Monitoring & Logs

### View Real-time Logs

```bash
npm run logs
```

Or:
```bash
firebase functions:log --only checkChallengeStatus
```

### View Logs in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `fit-friends-2ce27` project
3. Navigate to **Functions** → **Logs**

### Key Log Messages

- `"Starting scheduled challenge status check..."` - Function started
- `"Found X active challenges to check"` - Active challenges detected
- `"Challenge X has ended. Marking as inactive."` - Challenge closed
- `"Challenge X winner set: USERNAME with Y points"` - Winner determined
- `"Tie detected for challenge X..."` - Tie scenario
- `"Challenge status check completed successfully"` - Function completed

## Features & Improvements

### Bug Fixes
✅ **Fixed winner increment bug**: `challengesWon` now properly increments instead of being set to 1

### New Features
✅ **Tie-breaking logic**: When multiple participants have the same highest score, the winner is selected alphabetically by username
✅ **Tie tracking**: Tied participants are stored in `tiedParticipants` array on the challenge object
✅ **Winner points**: Challenge now stores `challengeWinnerPoints` for reference

### Performance Optimizations
✅ **Reduced frequency**: Changed from every 1 minute to every 5 minutes (saves ~86% of function invocations)
✅ **Query optimization**: Only fetches active challenges using Firebase query filters
✅ **Sequential processing**: Processes challenges one at a time to avoid database throttling

### Enhanced Error Handling
✅ **Comprehensive logging**: All operations logged with context
✅ **Null checks**: Validates existence of users, challenges, and participants
✅ **Error recovery**: Continues processing other challenges if one fails
✅ **Detailed error messages**: Includes challenge/user IDs in error logs

## Database Schema Updates

The Cloud Function adds/updates the following fields on challenge objects:

```javascript
{
  challengeWinner: "user_uid",           // Winner's user ID
  challengeWinnerUsername: "username",   // Winner's username
  challengeWinnerPoints: 150,            // Winner's total points (NEW)
  tiedParticipants: [                    // Only if tie occurred (NEW)
    {
      id: "user_uid_1",
      username: "user1",
      totalPoints: 150
    },
    {
      id: "user_uid_2",
      username: "user2",
      totalPoints: 150
    }
  ]
}
```

## Cost Estimation

**Firebase Functions Free Tier**:
- 2 million invocations/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month

**FitFriends Usage** (Every 5 minutes):
- Invocations per month: ~8,640
- Well within free tier limits

**Cost**: $0/month (100% free)

## Migrating from Old Server

The old Express server (`server/server.js`) can be decommissioned after deploying Cloud Functions:

1. Deploy Cloud Functions (see deployment section)
2. Verify scheduled function runs successfully via logs
3. Stop running `server/server.js` locally
4. (Optional) Remove `server/` directory after confirming Cloud Functions work

**Advantages over old server**:
- ✅ No need to keep computer running 24/7
- ✅ Automatic scaling and reliability
- ✅ Built-in monitoring and logging
- ✅ Free hosting (within generous limits)
- ✅ Integrated with Firebase ecosystem

## Troubleshooting

### Function not running on schedule

1. Check deployment status:
   ```bash
   firebase functions:list
   ```

2. Verify function is deployed:
   Look for `checkChallengeStatus` in the list

3. Check logs for errors:
   ```bash
   firebase functions:log --only checkChallengeStatus
   ```

### Database permission errors

Ensure Firebase Admin SDK has proper permissions. Cloud Functions deployed via Firebase CLI automatically have admin access.

### Timezone issues

Update the `timeZone` parameter in `index.js` to match your desired timezone. List of valid timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Manual testing

Use the `manualCheckChallenges` HTTP function to test without waiting for the schedule:

```bash
curl https://us-central1-fit-friends-2ce27.cloudfunctions.net/manualCheckChallenges
```

## Security Notes

- The `manualCheckChallenges` HTTP function is currently **unauthenticated**
- Consider removing it or adding authentication for production
- Firebase Admin SDK runs with full database access (by design)
- Cloud Functions are not directly accessible to frontend users

## Support

For issues or questions:
- Check Firebase Functions documentation: https://firebase.google.com/docs/functions
- Review Cloud Scheduler documentation: https://firebase.google.com/docs/functions/schedule-functions
- Contact: johnathanbryce@gmail.com

## License

ISC
