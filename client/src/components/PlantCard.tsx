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

export default function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Card variant="outlined">
      <CardMedia
        image={plant.image ? URL.createObjectURL(plant.image) : ""}
        title={plant.name}
        sx={{ height: 140 }}
      />
      <CardContent>
        <Typography gutterBottom sx={{ fontSize: 14 }}>
          {plant.latinName}
        </Typography>
        <Typography gutterBottom variant="h5">
          {plant.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }}>Pflanze</Typography>
        {/* TODO: fix display of order and displayed information */}
        Habitat: {plant.habitat.region} |{" "}
        {plant.habitat.waterQuality.temperature}°C
      </CardContent>
      <CardActions>
        <Button>Auswählen</Button>
      </CardActions>
    </Card>
  );
}
