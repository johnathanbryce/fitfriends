import { useState, useEffect } from 'react';
// Firebase
import { database } from '../../firebaseApp';
import { ref, get } from 'firebase/database';
// Auth Context
import { useAuth } from '@/context/AuthProvider'

export const useFetchUserData = () => {
  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false)

  // auth context
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true)
    if (user) {
      // define the reference to the user's data in the database using their uid
      const userRef = ref(database, `users/${user.uid}`);
      // fetch the user's data from the database
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // If the user's data exists, set it in the state
            const userData = snapshot.val();
            setUserData(userData);
            setIsLoading(false)
          } else {
            console.log('User data not found in the database');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user]);

  return {userData, isLoading}
}

