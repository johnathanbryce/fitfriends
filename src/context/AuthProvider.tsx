'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
// Firebase
import { initFirebase } from '../../firebaseApp';
// Firebase Auth for Google
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Next.js
import { useRouter } from 'next/navigation';


// TypeScript and Auth setup
export interface User {
    id: any,
    username: string,
    name: string,
    email: string,
    bio: string,
    phoneNumber: string | number,
    profile_image_url: string,
    dateOfBirth: string | number,
}

interface AuthContextState {
  user: User | null;
  newUser: boolean | null;
  handleLogin: (formData: any) => void;
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
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error('Error parsing stored user data:', error);
        }
    }
  }, []);

  const handleLogin = (userData: any) => {

  };

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