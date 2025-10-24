**FitFriends**

URL: https://fitfriends.ca/

FitFriends transforms your fitness journey into an engaging and competitive experience. By challenging friends in fitness battles, users earn points based on their dedication to cardio and weightlifting routines. This innovative platform is perfect for those looking to add a social and competitive edge to their fitness regime.

**Features**
- User Authentication: Secure login and signup process.
- Custom Fitness Challenges: Create and customize fitness challenges.
- Challenge Invitations: Invite friends to participate in challenges.
- Real-Time Tracking: Updates on challenge progress and leaderboards.
- Responsive Design: Accessible on various devices and screen sizes.

**Technologies**
- Frontend: Next.js 14, TypeScript, React 18, CSS Modules
- Backend: Firebase Cloud Functions (Node.js 22)
- Database: Firebase Realtime Database
- Authentication: Firebase Authentication
- Hosting: Firebase Hosting
- Scheduled Tasks: Firebase Cloud Functions (Scheduled)

**Getting Started**

**Prerequisites**
- Node.js 22.0 or higher
- npm or yarn
- Firebase CLI (for deploying functions): `npm install -g firebase-tools`

**Installation**
  1. Clone the repository: `git clone https://github.com/johnathanbryce/fitfriends.git`
  2. Install NPM packages: `npm install`
  3. Install Cloud Functions dependencies: `cd functions && npm install && cd ..`

**Running the Application**

**Frontend Development**
- To start the Next.js dev server: `npm run dev`
- Navigate to http://localhost:3000 to view the application

**Cloud Functions (Automated Challenge Management)**
- Cloud Functions automatically handle challenge lifecycle (closing challenges, determining winners)
- See [functions/README.md](functions/README.md) for detailed setup and deployment instructions
- To test locally: `cd functions && npm run serve`

**Deploying Cloud Functions**
```bash
firebase deploy --only functions
```

For detailed deployment instructions, see [functions/README.md](functions/README.md)

**Creating a Challenge**
- Step 1: Navigate to "challenges dashboard"
- Step 2: As you have just created an account, your "Your challenges" section will be empty. Select the "Create a challenge" button to start customizing your fitness challenge!
- Step 3: Add a challenge name, define your cardio and weights points, and select your challenge duration.
- Step 4: Voila, your challenge is now live and will automatically end and announce a winner on the last day you selected for your challenge duration.
- Step 5: Select the "add participants" button to invite registered fitfriends users to your challenge to compete!

**Contributing**
- Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

**Fork the Project**
- Create your Feature Branch (git checkout -b feature/AmazingFeature)
- Commit your Changes (git commit -m 'Add some AmazingFeature')
- Push to the Branch (git push origin feature/AmazingFeature)
- Open a Pull Request

**Contact**
Johnathan Bryce - johnathanbryce@gmail.com

Project Link: https://github.com/johnathanbryce/fitfriends
