import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import "../style/ProfilePicture.css";
import { Plant } from "../interfaces/Plant";


export default function PlantCard(
  {
    plant
  }: {
  plant: Plant
  }) {

  return (
    <Card variant="outlined">
      <CardMedia 
        image={plant.image}
        title={plant.name}
        sx={{ height: 140 }}
      />
      <CardContent>
      <Typography gutterBottom component="div">
          {plant.name}
        </Typography>
          <ul>
            {/* TODO: fix display of order and displayed information */}
            <li>Lat: {plant.latinName}</li>
            <li>Habitat: {plant.habitat.region} | {plant.habitat.waterQuality.temperature}°C</li> 
            <li>Farbe: {plant.color}</li>
            <li>Natürliche Feinde: <ul>{plant.predators.map(plant => <li>{plant.food}</li>)}</ul></li>
          </ul>
      </CardContent>
      <CardActions>
        <Button>Auswählen</Button>
      </CardActions>
    </Card>
  );
};
