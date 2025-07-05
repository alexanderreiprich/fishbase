import React, { useRef, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { UserRepository } from '../repositories/UserRepository';
import '../style/ProfilePictureUpload.css';

interface ProfilePictureUploadProps {
  onPictureUpdated?: () => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onPictureUpdated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validierung der Datei
    if (!file.type.startsWith('image/')) {
      setError('Bitte wählen Sie eine Bilddatei aus');
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB Limit
      setError('Die Datei ist zu groß. Maximale Größe: 1MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const repository = UserRepository.getInstance();
      await repository.updateProfilePicture(file);
      
      // Callback aufrufen, um die UI zu aktualisieren
      if (onPictureUpdated) {
        onPictureUpdated();
      }
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      setError('Fehler beim Hochladen des Bildes');
    } finally {
      setUploading(false);
    }

    // File input zurücksetzen
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box className="profile-picture-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="profile-picture-upload-input"
        onChange={handleFileChange}
      />
      
      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={uploading}
        className="profile-picture-upload-button"
      >
        {uploading ? 'Wird hochgeladen...' : 'Profilbild ändern'}
      </Button>

      {error && (
        <Typography className="profile-picture-upload-error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ProfilePictureUpload; 