import { database } from '../../firebaseApp';
import { ref, get } from 'firebase/database';

export async function fetchAllUsers() {
  const usersRef = ref(database, 'users');

  try {
    const usersSnapshot = await get(usersRef);

    if (usersSnapshot.exists()) {
      const users: any = [];
      
      usersSnapshot.forEach((childSnapshot) => {
        // Extract individual user objects and add them to the array
        const user = childSnapshot.val();
        users.push(user);
      });

      return users;
    } else {
      console.log('User data not found in the database');
      return [];
    }
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}
