import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import AquariumUpload from "../components/AquariumUpload";
import "../style/ProfilePage.css";
import { InhabitantRepository } from "../repositories/InhabitantRepository";
import { Inhabitant } from "../interfaces/Inhabitant";

const PersonalProfilePage: React.FC = () => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [ favFish, setFavFish ] = useState<Inhabitant | null>(null);

  const inhabitantRepository: InhabitantRepository = InhabitantRepository.getInstance();

  const handlePictureUpdated = async () => {
    await refreshUserData();
    setRefreshKey(prev => prev + 1);
  };

  const handleAquariumUpdated = async () => {
    await refreshUserData();
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (user?.favoritefish) {
      fetchFavoriteFish();
    }
  }, [user?.favoritefish]);

  const fetchFavoriteFish = async () => {
    const id: number = user?.favoritefish!;
    const inhabitant: Inhabitant = await inhabitantRepository.getInhabitantById(id);
    setFavFish(inhabitant);
  }

  // Redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box className="profile-container">
      <Paper className="profile-paper" elevation={3}>
        <Box className="profile-content">
          <Box className="profile-image-container">
            <img
              key={refreshKey}
              className="profile-image"
              src={user?.picture ? (() => {
                if (typeof user.picture === 'string') {
                  // Base64-String zu Blob konvertieren
                  const byteCharacters = atob(user.picture);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: 'image/jpeg' });
                  return URL.createObjectURL(blob);
                }
                return URL.createObjectURL(user.picture);
              })() : "/images/default_profile_image.png"}
              alt="Profilbild"
            />
            <Box>
              <Typography
                variant="h2"
                component="h1"
                className="profile-username"
              >
                {user?.username}
              </Typography>
            </Box>
            <Box className="upload-buttons-container">
              <ProfilePictureUpload onPictureUpdated={handlePictureUpdated} />
              <AquariumUpload onAquariumUpdated={handleAquariumUpdated} />
            </Box>
          </Box>
          <Box className="profile-subheader-container">
            <Typography variant="h3" component="h3" className="profile-subheader-text">
              Aquariums
            </Typography>
          </Box>
          
          {user?.aquarium && (
            <Box className="aquarium-section">
              <Typography variant="h4" component="h4" className="aquarium-title">
                Mein Aquarium
              </Typography>
              <img
                className="aquarium-image"
                src={(() => {
                  if (typeof user.aquarium === 'string') {
                    // Base64-String zu Blob konvertieren
                    const byteCharacters = atob(user.aquarium);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'image/jpeg' });
                    return URL.createObjectURL(blob);
                  }
                  return URL.createObjectURL(user.aquarium);
                })()}
                alt="Aquarium"
              />
            </Box>
          )}
        </Box>
        {user?.favoritefish && (
          <Box className="favorite-fish-section">
            <Typography variant="h4" component="h4" className="favorite-fish-title">
              Mein Lieblingsfisch
            </Typography>
            <Typography variant="h5" component="h5" className="favorite-fish">
              {favFish?.name}
            </Typography>
            
          </Box>
        )}
        <Box sx={{ mt: 4 }}>
          <LogoutButton />
        </Box>
      </Paper>
    </Box>
  );
};

export default PersonalProfilePage;
