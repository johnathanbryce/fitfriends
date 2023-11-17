// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDicrUfmF7PuwZhZ7y40iYuayPIK2o4UHk",
  authDomain: "fit-friends-2ce27.firebaseapp.com",
  projectId: "fit-friends-2ce27",
  storageBucket: "gs://fit-friends-2ce27.appspot.com",
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

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize database
export const database = getDatabase(app)

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app)
