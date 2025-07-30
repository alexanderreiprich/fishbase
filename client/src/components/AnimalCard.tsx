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
import QuantityModal from "./QuantityModal";
import { useState } from "react";

export default function AnimalCard({
  animal,
  onAddToAquarium,
  isPredatorConflict,
}: {
  animal: Animal;
  onAddToAquarium?: (inhabitantId: number, quantity: number) => void;
  isPredatorConflict: boolean;
}) {
  const { user, refreshUserData } = useAuth();
  const userRepository = UserRepository.getInstance();
  const [modalOpen, setModalOpen] = useState(false);

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
      console.error("Fehler beim Aktualisieren des Lieblingsfisches:", error);
    }
  };

  const handleAddToAquarium = () => {
    setModalOpen(true);
  };

  const handleModalConfirm = (quantity: number) => {
    if (onAddToAquarium) {
      onAddToAquarium(animal.id, quantity);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 500,
          position: "relative",
          borderColor: isPredatorConflict ? "red" : "var(--primary-main)",
          borderWidth: isPredatorConflict ? 2 : 1,
        }}
      >
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            {isFavorite ? (
              <Star sx={{ color: "#FFD700" }} />
            ) : (
              <StarBorder sx={{ color: "#666" }} />
            )}
          </IconButton>
        </Box>
        <CardMedia
          image={animal.image ? URL.createObjectURL(animal.image) : ""}
          title={animal.name}
          sx={{ height: 240 }}
        />
        <CardContent>
          <Typography gutterBottom sx={{ fontSize: 14 }}>
            {animal.latinName}
          </Typography>
          <Typography gutterBottom variant="h5">
            {animal.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>{getAnimalType()}</Typography>
          Habitat: {animal.habitat.region} |{" "}
          {animal.habitat.waterQuality.temperature}°C
          {isPredatorConflict ? (
          <Typography gutterBottom sx={{ fontSize: 12, marginTop: "15px" }}>
            Dieses Tier ist inkompatibel, da es ist einem Fressverhältnis zu einem anderen Tier steht!
            Hinzufügen auf eigene Gefahr!
          </Typography>
        ) : null}
        </CardContent>
        {onAddToAquarium ? (
          <CardActions>
            <Button onClick={handleAddToAquarium}>Auswählen</Button>
          </CardActions>
        ) : null}
      </Card>

      <QuantityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        inhabitant={animal}
      />
    </>
  );
}
