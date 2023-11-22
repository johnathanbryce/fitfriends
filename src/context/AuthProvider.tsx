'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
// Firebase
import { initFirebase } from '../../firebaseApp';
// Firebase Auth for Google
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
// Next.js
import { useRouter, redirect } from 'next/navigation';
// Firebase Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';
// Firebase 
import { database, auth } from '../../firebaseApp';
import { ref, get, set } from 'firebase/database';

// TypeScript and Auth setup
export interface User {
    uid: any,
    userName: string,
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
  authError: string | null;
  isPasswordResetSent: boolean | null;
  isLoading: boolean;
  clearAuthError: () => void,
  handleLogin: (email: string, password: string) => void;
  handleSignInWithGoogle: (e: any) => void;
  handleLogout: () => void;
  handleSignup: (email: string, password: string, userData: any) => void;
  forgotPassword: (email: string) => void; 
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  newUser: null,
  authError: null,
  isLoading: false,
  isPasswordResetSent: false,
  clearAuthError: () => {},
  handleLogin: () => {},
  handleSignInWithGoogle: () => {},
  handleLogout: () => {},
  handleSignup: () => {},
  forgotPassword: () => {},
});

export const useAuth = () => useContext(AuthContext);

// The AuthProvider.tsx context function:
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [newUser, setNewUser] = useState(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPasswordResetSent, setPasswordResetSent] = useState(false);

  // Firebase Auth
  initFirebase(); // configures firebase in our app
  const auth = getAuth(); // Get Firebase auth instance

  // Google Specific Auth
  const googleProvider = new GoogleAuthProvider();
  const googleAuth = getAuth()

  // Routing
  const router = useRouter();

  // clears any authErrors when a user navigates away from login/sign-up/forgot-password
  const clearAuthError = () => {
    setAuthError(null);
  };
  
  // restore user auth state after a page refresh
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

  const handleSignup = async(email: string, password: string, userData: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      const userRef = ref(database, `users/${user.uid}`);

      const mergedUserData = {...userData, uid: user.uid}
      await set(userRef, mergedUserData);

      setIsLoading(false);
      setUser(mergedUserData); // set the user in the context
      localStorage.setItem('user', JSON.stringify(mergedUserData)); 
      router.replace(`/intro`);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-email') {
        setAuthError('Invalid or missing email address. Please input again.')
      } else if (error.code === 'auth/weak-password' || error.code === 'auth/missing-password') {
        setAuthError('Invalid or missing password')
      } else if(error.code === 'auth/email-already-in-use') {
         setAuthError('This email is already registered. Please try another.')
      } 
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthError(null);
      setIsLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      if (loggedInUser) {
        // check if the user exists in the db
        const userRef = ref(database, `users/${loggedInUser.uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          // user exists in the "users" bucket so set user in Context state
          setUser(loggedInUser);
          setIsLoading(false);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          router.replace(`/challenges-dashboard`);
        } else {
          setAuthError('User does not exist. Please sign up to register your account.')
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setIsLoading(false);
        setAuthError('Invalid email. Please check your email address.');
      } else if (error.code === 'auth/missing-password') {
        setIsLoading(false);
        setAuthError('Wrong or missing password. Please check your password.');
      } else  if(error.code === 'auth/invalid-login-credentials'){
        setIsLoading(false);
        setAuthError('Invalid credentials. Please check your email or password.');
      } else {
        setIsLoading(false);
        setAuthError('An unknown error occurred. Please try again.');
      }
    }
  }

  const handleSignInWithGoogle = async (e: any) => {
    e.preventDefault();
    try {
      const loginResult = await signInWithPopup(googleAuth, googleProvider);
      const googleUser = loginResult.user;
  
      // check if the user's email exists in your database
      const userRef = ref(database, `users`);
      const userSnapshot = await get(userRef);
  
      const userEmail = googleUser.email;
      let userExists = false;
  
      userSnapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.email === userEmail) {
          userExists = true;
          return; // stop iterating if a matching email is found
        }
      });
  
      if (userExists) {
        // user exists in your database, proceed with authentication
        setUser(googleUser);
        localStorage.setItem('user', JSON.stringify(googleUser)); 
        router.replace('/challenges-dashboard');
      } else {
        // user doesn't exist in your database, prevent Firebase Authentication
        await googleAuth.signOut(); // Sign out the Google user
        setAuthError('Your Google account is not registered. Please sign-up.')
        console.log('Error: User not found in the database');
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setIsLoading(false);
        setAuthError('Invalid email. Please check your email address.');
      }
      console.log('error', error.code);
    }
  }
  
  

 
  const handleLogout = async () => {
    if(user === null){
      return;
    }
    await auth.signOut();
    setUser(null);
    setIsLoading(false);
    setAuthError('');
    localStorage.removeItem('user');
    router.replace('/login')
    /* redirect('/login') */
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      setPasswordResetSent(true)
      setIsLoading(false);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address. Please try again.')
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('This email address is not registered. Please try again.')
      } 
      setPasswordResetSent(false)
      setIsLoading(false)
      // Handle errors
      console.error('Error sending password reset email:', error.message);
    }
  };
  

  return (
    <AuthContext.Provider value={{ 
        user, 
        newUser,
        authError,
        isLoading,
        isPasswordResetSent,
        clearAuthError: clearAuthError,
        handleLogin: handleLogin, 
        handleSignInWithGoogle: handleSignInWithGoogle,
        handleLogout: handleLogout, 
        handleSignup: handleSignup,
        forgotPassword: forgotPassword,
        }}>
      {children}
    </AuthContext.Provider>
  );
}