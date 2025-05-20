import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import "../style/ProfilePicture.css";
import { Inhabitant } from "../interfaces/Inhabitant";


export default function InhabitantCard(
  {
    inhabitant
  }: {
  inhabitant: Inhabitant
  }) {

  return (
    <Card variant="outlined">
      <CardMedia 
        image={inhabitant.image}
        title={inhabitant.name}
      />
      <CardContent>
        <Typography gutterBottom component="div">
          {inhabitant.name}
        </Typography>
        <Typography variant="body2">
          <ul>
            {/* TODO: fix display of order and displayed information */}
            <li>Lat: {inhabitant.latinName}</li>
            <li>Habitat: {inhabitant.habitat.region} | {inhabitant.habitat.waterQuality.salinity}</li> 
            <li>Farbe: {inhabitant.color}</li>
            <li>Natürliche Feinde: <ul>{inhabitant.predators.map(animal => <li>{animal.food}</li>)}</ul></li>
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );
};
