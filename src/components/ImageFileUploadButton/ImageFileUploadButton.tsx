'use client'
import { useState } from 'react';
import styles from './ImageFileUpload.module.css'

interface ImageFileUploadButtonProps{
    onFileChange: (file: File | null) => void;
}

export default function ImageFileUploadButton({ onFileChange }: ImageFileUploadButtonProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 

    const handleFileUpload = (files: FileList | null) => {
        if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);

        if (onFileChange) {
            onFileChange(file);
        }
        } else {
        // if no file is selected, reset the state
        setSelectedFile(null);

        if (onFileChange) {
            onFileChange(null);
        }
        }
    };

  return (
    <div className={styles.file_upload}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
    </div>
  );
}


