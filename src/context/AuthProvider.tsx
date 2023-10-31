'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
// Firebase
import { initFirebase } from '../../firebaseApp';
// Firebase Auth for Google
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Next.js
import { useRouter } from 'next/navigation';
// Firebase Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// Firebase 
import { database, auth } from '../../firebaseApp';
import { ref, get, set } from 'firebase/database';

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
  authError: string | null;
  isLoading: boolean;
  handleLogin: (email: string, password: string) => void;
  handleSignInWithGoogle: () => void;
  handleLogout: () => void;
  handleSignup: (email: string, password: string, userData: any) => void;
  resendConfirmation: (email: string) => void;
  resetPassword: (e: any) => void;
  forgotPassword: (email: string) => void; 
}

const AuthContext = createContext<AuthContextState>({
  user: null,
  newUser: null,
  authError: null,
  isLoading: false,
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Firebase Auth
  initFirebase(); // configures firebase in our app
  const auth = getAuth(); // Get Firebase auth instance

  // Google Specific Auth
  const googleProvider = new GoogleAuthProvider();
  const googleAuth = getAuth()

  // Routing
  const router = useRouter();
  
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

      const userRef = ref(database, `users/${user.uid}`);

      const userDataWithMatchingUID = {...userData, uid: user.uid}
      await set(userRef, userDataWithMatchingUID);

      setIsLoading(false);
      setUser(user); // Set the user in the context
      localStorage.setItem('user', JSON.stringify(user)); 
      router.replace(`/challenges`);
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
          router.replace(`/challenges`);
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
    if(user === null){
      console.log('Not logged in')
      return;
    }
    auth.signOut();
    setUser(null);
    setIsLoading(false);
    setAuthError('');
    localStorage.removeItem('user');
    router.replace('/')
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
        authError,
        isLoading,
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