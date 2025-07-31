import React, { useEffect, useState } from "react";
import { Typography, Paper, Box, Card, CardContent, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import "../style/ProfilePage.css";
import { User } from "../interfaces/User";
import { UserRepository } from "../repositories/UserRepository";
import { Inhabitant } from "../interfaces/Inhabitant";
import { InhabitantRepository } from "../repositories/InhabitantRepository";
import { AquariumRepository } from "../repositories/AquariumRepository";
import { Aquarium } from "../interfaces/Aquarium";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const user_id = userId ? parseInt(userId, 10) : 0;
  const [user, setUser] = useState<User | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favFish, setFavFish] = useState<Inhabitant | null>(null);

  const inhabitantRepository: InhabitantRepository =
    InhabitantRepository.getInstance();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const repository = UserRepository.getInstance();
        const tankRepository: AquariumRepository =
          AquariumRepository.getInstance();
        const userData = await repository.getUserById(user_id);
        const aquariumData = await tankRepository.getAquariumsOfUser(user_id);
        setUser(userData);
        setAquariums(aquariumData);
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
        setError("Fehler beim Laden der Benutzerdaten");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.favoritefish]);

  const fetchFavoriteFish = async () => {
    const id: number = user?.favoritefish!;
    try {
      const inhabitant: Inhabitant =
        await inhabitantRepository.getInhabitantById(id);
      setFavFish(inhabitant);
    } catch (error) {
      console.error("Fehler beim Laden des Lieblingsfisches:", error);
    }
  };

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
          </Box>
          {user?.tank && (
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
                  if (typeof user.tank === "string") {
                    // Base64-String zu Blob konvertieren
                    const byteCharacters = atob(user.tank);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "image/jpeg" });
                    return URL.createObjectURL(blob);
                  }
                  return URL.createObjectURL(user.tank);
                })()}
                alt="Aquarium"
              />
            </Box>
          )}
        </Box>
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
        {user?.favoritefish && (
            <Box className="favorite-fish-section" sx={{mt: 4}}>
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
      </Paper>
    </Box>
  );
};

export default ProfilePage;
