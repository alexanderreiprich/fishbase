import { Grid } from "@mui/material";
import AnimalCard from "../components/AnimalCard";
import { Animal } from "../interfaces/Animal";

import '../style/ListPage.css';
import { MockData } from "../data/mockdata";
import { Plant } from "../interfaces/Plant";
import PlantCard from "../components/PlantCard";

const ListPage: React.FC = () => {

  let mockdata: MockData = new MockData();

  let x: Animal = mockdata.getMockAnimal();
  let y: Plant = mockdata.getMockPlant();

  return <div>
    <Grid container spacing={1}>
    <AnimalCard animal={
      x
    } />
    <PlantCard plant={
      y
    } />
    </Grid>
  </div>;
};

export default ListPage;	