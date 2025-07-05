import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import "../style/ProfilePage.css";
import { User } from "../interfaces/User";
import { UserRepository } from "../repositories/UserRepository";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const user_id = userId ? parseInt(userId, 10) : 0;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              src={user?.profile_image ? URL.createObjectURL(user?.profile_image) : "/images/default_profile_image.png"}
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
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
