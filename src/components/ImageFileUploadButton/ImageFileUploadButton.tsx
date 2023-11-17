'use client'
import { useState, useRef } from 'react';
import styles from './ImageFileUpload.module.css'
// Internal Components
import ButtonPill from '../Buttons/ButtonPill/ButtonPill';
// Firebase Storage
import { storage } from '../../../firebaseApp';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// Firebase Database
import { database } from '../../../firebaseApp';
import { ref, update } from 'firebase/database';


interface ImageFileUploadButtonProps {
  onFileChange: (url: string | null) => void;
  uid: string,
}

export default function ImageFileUploadButton({ onFileChange, uid }: ImageFileUploadButtonProps) {
  // ref for custom button
  const fileInputRef = useRef<any>(null);
  // state for file
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null); 

  const updateUserProfilePicture = async (userId: string, imageUrl: string) => {
    // Reference to the user's profile in the Realtime Database
    const userProfileRef = ref(database, `users/${userId}`);

    // Update the profile picture URL
    try {
      await update(userProfileRef, {
        profilePicture: imageUrl
      });
      console.log("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        // storage ref
        const fileRef = storageRef(storage, `profilePictures/${uid}/${file.name}`);
        try {
            // upload file to Firebase Storage
            await uploadBytes(fileRef, file);
            // get the download URL
            const downloadURL = await getDownloadURL(fileRef);
            // call the onFileChange callback with the download URL
            onFileChange(downloadURL);
            // Update user's profile picture in Realtime Database
            await updateUserProfilePicture(uid, downloadURL);
        } catch (error) {
            console.error('Error uploading file:', error);
            onFileChange(null);
        }
    } else {
        setSelectedFile(null);
        onFileChange(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.file_upload}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files)}
        ref={fileInputRef}
        className={styles.hidden_input}
      />
      <ButtonPill
        label='Upload'
        onClick={handleButtonClick}
        isLoading={false}
      />
    </div>
  );
}


