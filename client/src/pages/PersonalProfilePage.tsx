import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "../style/ProfilePage.css";

const PersonalProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

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

        <Box sx={{ mt: 4 }}>
          <LogoutButton />
        </Box>
      </Paper>
    </Box>
  );
};

export default PersonalProfilePage;
