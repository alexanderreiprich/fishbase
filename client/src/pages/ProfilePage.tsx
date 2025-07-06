import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import "../style/ProfilePage.css";
import { User } from "../interfaces/User";
import { UserRepository } from "../repositories/UserRepository";
import { Inhabitant } from "../interfaces/Inhabitant";
import { InhabitantRepository } from "../repositories/InhabitantRepository";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const user_id = userId ? parseInt(userId, 10) : 0;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ favFish, setFavFish ] = useState<Inhabitant | null>(null);

  const inhabitantRepository: InhabitantRepository = InhabitantRepository.getInstance();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const repository = UserRepository.getInstance();
        const userData = await repository.getUserById(user_id);
        setUser(userData);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        setError('Fehler beim Laden der Benutzerdaten');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_id]);

  useEffect(() => {
    if (user?.favoritefish) {
      fetchFavoriteFish();
    }
  }, [user?.favoritefish]);

  const fetchFavoriteFish = async () => {
    const id: number = user?.favoritefish!;
    try {
      const inhabitant: Inhabitant = await inhabitantRepository.getInhabitantById(id);
      setFavFish(inhabitant);
    } catch (error) {
      console.error("Fehler beim Laden des Lieblingsfisches:", error);
    }
  }

  if (loading) {
    return (
      <Box className="profile-container">
        <Typography>Lädt...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="profile-container">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!userId || isNaN(user_id) || user_id <= 0) {
    return (
      <Box className="profile-container">
        <Typography color="error">Ungültige Benutzer-ID</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="profile-container">
        <Typography>Benutzer nicht gefunden</Typography>
      </Box>
    );
  }

  return (
    <Box className="profile-container">
      <Paper className="profile-paper" elevation={3}>
        <Box className="profile-content">
          <Box className="profile-image-container">
            <img
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
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
