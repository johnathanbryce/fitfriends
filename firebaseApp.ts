// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDicrUfmF7PuwZhZ7y40iYuayPIK2o4UHk",
  authDomain: "fit-friends-2ce27.firebaseapp.com",
  projectId: "fit-friends-2ce27",
  storageBucket: "fit-friends-2ce27.appspot.com",
  messagingSenderId: "946459046301",
  appId: "1:946459046301:web:d0efcc1b9247ec91443f74",
  measurementId: "G-T0KTVTVW9M",
  databaseURL: 'https://fit-friends-2ce27-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export function to initiliaze firebase
export const initFirebase = () => {
    return app;
}

// Initialize database
export const database = getDatabase(app)

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app)
