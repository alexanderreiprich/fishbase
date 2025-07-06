import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import "../style/ProfilePicture.css";
import { Animal } from "../interfaces/Animal";
import { InhabitantType } from "../interfaces/InhabitantType";
import { useAuth } from "../context/AuthContext";
import { UserRepository } from "../repositories/UserRepository";

export default function AnimalCard({ animal }: { animal: Animal }) {
  const { user, refreshUserData } = useAuth();
  const userRepository = UserRepository.getInstance();

  function getAnimalType() {
    switch (animal.type) {
      case InhabitantType.FISH:
        return "Fisch";
      case InhabitantType.INVERTEBRATE:
        return "Wirbellose";
      default:
        return "Tier";
    }
  }

  const isFavorite = user?.favoritefish === animal.id;

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        // Lieblingsfisch entfernen
        await userRepository.updateFavoriteFish(null);
      } else {
        // Lieblingsfisch setzen
        await userRepository.updateFavoriteFish(animal.id);
      }
      await refreshUserData();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Lieblingsfisches:', error);
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 300, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          {isFavorite ? (
            <Star sx={{ color: '#FFD700' }} />
          ) : (
            <StarBorder sx={{ color: '#666' }} />
          )}
        </IconButton>
      </Box>
      <CardMedia
        image={animal.image ? URL.createObjectURL(animal.image) : ""}
        title={animal.name}
        sx={{ height: 140 }}
      />
      <CardContent>
        <Typography gutterBottom sx={{ fontSize: 14 }}>
          {animal.latinName}
        </Typography>
        <Typography gutterBottom variant="h5">
          {animal.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }}>{getAnimalType()}</Typography>
        {/* TODO: fix display of order and displayed information */}
        Habitat: {animal.habitat.region} |{" "}
        {animal.habitat.waterQuality.temperature}°C
      </CardContent>
      <CardActions>
        <Button>Auswählen</Button>
      </CardActions>
    </Card>
  );
}
