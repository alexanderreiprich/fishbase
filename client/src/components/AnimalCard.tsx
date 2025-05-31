import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import "../style/ProfilePicture.css";
import { Animal } from "../interfaces/Animal";
import { InhabitantType } from "../interfaces/InhabitantType";


export default function AnimalCard(
  {
    animal
  }: {
  animal: Animal
  }) {

  function getAnimalType() {
    switch (animal.type) {
      case 0: return "Fisch";
      case 1: return "Wirbellose";
      default: return "Lebendig";
    }
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 300}}>
      <CardMedia 
        image={animal.image}
        title={animal.name}
        sx={{ height: 140 }}
      />
      <CardContent>
        <Typography gutterBottom sx={{ fontSize: 14 }}>
          {animal.latinName}
        </Typography>
        <Typography gutterBottom variant="h5" >
          {animal.name}
        </Typography>
        <Typography sx={{mb: 1.5}}>
          {getAnimalType()}
        </Typography>
            {/* TODO: fix display of order and displayed information */}
            Habitat: {animal.habitat.region} | {animal.habitat.waterQuality.temperature}°C
            Farbe: {animal.color}
            Natürliche Feinde: <ul>{animal.predators.map(animal => <li>{animal.food}</li>)}</ul>
      </CardContent>
      <CardActions>
        <Button>Auswählen</Button>
      </CardActions>
    </Card>
  );
};
