import React, { useRef, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import '../style/AquariumUpload.css';

interface AquariumUploadProps {
  onAquariumUpdated?: () => void;
}

const AquariumUpload: React.FC<AquariumUploadProps> = ({ onAquariumUpdated }) => {
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

    if (file.size > 4 * 1024 * 1024) { // 4MB Limit
      setError('Die Datei ist zu groß. Maximale Größe: 4MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Bild zu Base64 konvertieren
      const base64 = await fileToBase64(file);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/api/users/profile/aquarium', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ aquarium: base64 })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Aquarium-Bildes');
      }
      
      // Callback aufrufen, um die UI zu aktualisieren
      if (onAquariumUpdated) {
        onAquariumUpdated();
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Entferne den "data:image/...;base64," Prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Box className="aquarium-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="aquarium-upload-input"
        onChange={handleFileChange}
      />
      
      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={uploading}
        className="aquarium-upload-button"
      >
        {uploading ? 'Wird hochgeladen...' : 'Aquarium-Bild ändern'}
      </Button>

      {error && (
        <Typography className="aquarium-upload-error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default AquariumUpload; 