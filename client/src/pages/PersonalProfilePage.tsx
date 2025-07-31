import React, { useEffect, useState } from "react";
import { Typography, Paper, Box, Grid, Card, CardContent } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import AquariumUpload from "../components/AquariumUpload";
import "../style/ProfilePage.css";
import { InhabitantRepository } from "../repositories/InhabitantRepository";
import { Inhabitant } from "../interfaces/Inhabitant";
import { AquariumRepository } from "../repositories/AquariumRepository";
import { Aquarium } from "../interfaces/Aquarium";

const PersonalProfilePage: React.FC = () => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [favFish, setFavFish] = useState<Inhabitant | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[] | null>(null);

  const inhabitantRepository: InhabitantRepository =
    InhabitantRepository.getInstance();

  const aquariumRepository: AquariumRepository =
    AquariumRepository.getInstance();

  const handlePictureUpdated = async () => {
    await refreshUserData();
    setRefreshKey((prev) => prev + 1);
  };

  const handleAquariumUpdated = async () => {
    await refreshUserData();
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (user?.favoritefish) {
      fetchFavoriteFish();
    }
    if (user) {
      fetchAquariums();
    }

    // otherwise update on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.favoritefish]);

  const fetchFavoriteFish = async () => {
    const id: number = user?.favoritefish!;
    const inhabitant: Inhabitant = await inhabitantRepository.getInhabitantById(
      id
    );
    setFavFish(inhabitant);
  };

  const fetchAquariums = async () => {
    const id: number = user!.id;
    const aquariums: Aquarium[] = await aquariumRepository.getAquariumsOfUser(
      id
    );
    setAquariums(aquariums);
  };

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
              src={
                user?.picture
                  ? (() => {
                      if (typeof user.picture === "string") {
                        // Base64-String zu Blob konvertieren
                        const byteCharacters = atob(user.picture);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], {
                          type: "image/jpeg",
                        });
                        return URL.createObjectURL(blob);
                      }
                      return URL.createObjectURL(user.picture);
                    })()
                  : "/images/default_profile_image.png"
              }
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
              <LogoutButton />
            </Box>
          </Box>
          {user?.favoritefish && (
            <Box className="favorite-fish-section">
              <Typography
                variant="h4"
                component="h4"
                className="favorite-fish-title"
              >
                Mein Lieblingsfisch
              </Typography>
              <Typography variant="h5" component="h5" className="favorite-fish">
                {favFish?.name}
              </Typography>
            </Box>
          )}
          {user?.aquarium && (
            <Box className="aquarium-section">
              <Typography
                variant="h4"
                component="h4"
                className="aquarium-title"
              >
                Mein Heim-Aquarium
              </Typography>
              <img
                className="aquarium-image"
                src={(() => {
                  if (typeof user.aquarium === "string") {
                    // Base64-String zu Blob konvertieren
                    const byteCharacters = atob(user.aquarium);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "image/jpeg" });
                    return URL.createObjectURL(blob);
                  }
                  return URL.createObjectURL(user.aquarium);
                })()}
                alt="Aquarium"
              />
            </Box>
          )}
          {aquariums && (
            <>
              <Box className="profile-subheader-container">
                <Typography
                  variant="h4"
                  component="h4"
                  className="profile-subheader-text"
                >
                  Meine Aquarien ({aquariums.length})
                </Typography>
              </Box>
              <Box className="profile-subheader-box">
                <Grid container spacing={3}>
                  {aquariums.map((aquarium) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={aquarium.id}>
                      <Card
                        variant="outlined"
                        sx={{ height: "100%", borderColor: "white" }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {aquarium.name || `Aquarium ${aquarium.id}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            gutterBottom
                          >
                            Fassungsvermögen: {aquarium.capacity}L
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            gutterBottom
                          >
                            Inhabitant ({aquarium.inhabitants.length}):
                          </Typography>
                          {aquarium.inhabitants.length > 0 ? (
                            <Box sx={{ pl: 2 }}>
                              {aquarium.inhabitants.map((inhabitant, index) => (
                                <Typography
                                  key={inhabitant.id}
                                  variant="body2"
                                  color="text.primary"
                                  sx={{
                                    fontSize: "0.875rem",
                                    mb:
                                      index < aquarium.inhabitants.length - 1
                                        ? 0.5
                                        : 0,
                                  }}
                                >
                                  • {inhabitant.name} ({inhabitant.latinName})
                                </Typography>
                              ))}
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ pl: 2, fontStyle: "italic" }}
                            >
                              Keine Inhabitant vorhanden
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {aquariums.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.primary">
                      Sie haben noch keine Aquarien erstellt.
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PersonalProfilePage;
