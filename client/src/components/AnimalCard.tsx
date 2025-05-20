import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import "../style/ProfilePicture.css";
import { Animal } from "../interfaces/Animal";


export default function AnimalCard(
  {
    animal
  }: {
  animal: Animal
  }) {

  return (
    <Card variant="outlined" sx={{ maxWidth: 300}}>
      <CardMedia 
        image={animal.image}
        title={animal.name}
        sx={{ height: 140 }}
      />
      <CardContent>
        <Typography gutterBottom component="div">
          {animal.name}
        </Typography>
          <ul>
            {/* TODO: fix display of order and displayed information */}
            <li>Lat: {animal.latinName}</li>
            <li>Habitat: {animal.habitat.region} | {animal.habitat.waterQuality.temperature}°C</li> 
            <li>Farbe: {animal.color}</li>
            <li>Natürliche Feinde: <ul>{animal.predators.map(animal => <li>{animal.food}</li>)}</ul></li>
          </ul>
      </CardContent>
      <CardActions>
        <Button>Auswählen</Button>
      </CardActions>
    </Card>
  );
};
