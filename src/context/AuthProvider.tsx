'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
// Firebase
import { initFirebase } from '../../firebaseApp';
// Firebase Auth for Google
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Next.js
import { useRouter } from 'next/navigation';
// Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
// Firebase 
import { database, auth } from '../../firebaseApp';
import { ref, get } from 'firebase/database';


// TypeScript and Auth setup
export interface User {
    uid: any,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    bio: string,
    challenges: object,
    profilePicture: any,
    totalPointsOverall: object,
}

interface AuthContextState {
  user: User | null;
  newUser: boolean | null;
  handleLogin: (email: string, password: string) => void;
  handleSignInWithGoogle: () => void;
  handleLogout: () => void;
  handleSignup: (formData: any) => void;
  resendConfirmation: (email: string) => void;
  resetPassword: (e: any) => void;
  forgotPassword: (email: string) => void; 
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  newUser: null,
  handleLogin: () => {},
  handleSignInWithGoogle: () => {},
  handleLogout: () => {},
  handleSignup: () => {},
  resendConfirmation: () => {},
  resetPassword:  () => {},
  forgotPassword: () => {},
  
});

export const useAuth = () => useContext(AuthContext);

// The AuthProvider.tsx context function:
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [newUser, setNewUser] = useState(null);

  // Firebase Auth
  initFirebase(); // configures firebase in our app
  const auth = getAuth(); // Get Firebase auth instance

  // Google Specific Auth
  const googleProvider = new GoogleAuthProvider();
  const googleAuth = getAuth()

  // Routing
  const router = useRouter();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      if (loggedInUser) {
        // Check if the user exists in the Realtime Database
        const userRef = ref(database, `users/${loggedInUser.uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          // User exists in the "users" bucket
          console.log(`user ${loggedInUser.uid} exists`);
          setUser(loggedInUser);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          router.replace(`/dashboard/${user.uid}`);
        } else {
          console.log('user not authorized');
          // User does not exist in the "users" bucket
          // Handle the case where the user is not authorized
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle authentication error here
    }
  }

  const handleSignInWithGoogle = async() => {
    try {
        const loginResult = await signInWithPopup(googleAuth, googleProvider);
        setUser(loginResult.user)
        // sets local storage for routing 
        localStorage.setItem('user', JSON.stringify(loginResult.user)); 
        // routes to dashboard
        router.replace('/dashboard');
    } catch (error) {
        console.log('error', error)
    }
  }

 
  const handleLogout = async () => {
    console.log('logout')
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleSignup = (userData: any) => {

  };

  const resendConfirmation = async (email: string) => {
   
  }

  const forgotPassword = async (email: string) => {
  
  }

  const resetPassword = async (email: any) => {

  }

  return (
    <AuthContext.Provider value={{ 
        user, 
        newUser,
        handleLogin: handleLogin, 
        handleSignInWithGoogle: handleSignInWithGoogle,
        handleLogout: handleLogout, 
        handleSignup: handleSignup,
        resendConfirmation: resendConfirmation,
        forgotPassword: forgotPassword,
        resetPassword: resetPassword,

        }}>
      {children}
    </AuthContext.Provider>
  );
}