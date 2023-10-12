// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDicrUfmF7PuwZhZ7y40iYuayPIK2o4UHk",
  authDomain: "fit-friends-2ce27.firebaseapp.com",
  projectId: "fit-friends-2ce27",
  storageBucket: "fit-friends-2ce27.appspot.com",
  messagingSenderId: "946459046301",
  appId: "1:946459046301:web:d0efcc1b9247ec91443f74",
  measurementId: "G-T0KTVTVW9M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Export function to initiliaze firebase
export const initFirebase = () => {
    return app;
}