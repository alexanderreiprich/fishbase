import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "../style/ProfilePicture.css";
import { Plant } from "../interfaces/Plant";
import QuantityModal from "./QuantityModal";
import { useState } from "react";

export default function PlantCard({ 
  plant, 
  onAddToAquarium 
}: { 
  plant: Plant;
  onAddToAquarium?: (inhabitantId: number, quantity: number) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddToAquarium = () => {
    setModalOpen(true);
  };

  const handleModalConfirm = (quantity: number) => {
    if (onAddToAquarium) {
      onAddToAquarium(plant.id, quantity);
    }
  };

  return (
    <>
      <Card 
      variant="outlined"
      sx={{
        maxWidth: 500,
        position: "relative",
        borderColor: "var(--primary-main)",
        borderWidth: 1,
      }}
      >
        <CardMedia
          image={plant.image ? URL.createObjectURL(plant.image) : ""}
          title={plant.name}
          sx={{ height: 240 }}
        />
        <CardContent>
          <Typography gutterBottom sx={{ fontSize: 14 }}>
            {plant.latinName}
          </Typography>
          <Typography gutterBottom variant="h5">
            {plant.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>Pflanze</Typography>
          Habitat: {plant.habitat.region} |{" "}
          {plant.habitat.waterQuality.temperature}°C
        </CardContent>
        <CardActions>
          <Button onClick={handleAddToAquarium}>Auswählen</Button>
        </CardActions>
      </Card>

      <QuantityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        inhabitant={plant}
      />
    </>
  );
}
