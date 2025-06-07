import { Grid } from "@mui/material";
import AnimalCard from "../components/AnimalCard";
import { Animal } from "../interfaces/Animal";
import { Plant } from "../interfaces/Plant";
import { MockData } from "../data/mockdata";
import { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";

const SearchPage: React.FC = () => {
  const [mockAnimal, setMockAnimal] = useState<Animal | null>(null);
  const [mockPlant, setMockPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = async () => {
      try {
        const mockdata = new MockData();
        const [animal, plant] = await Promise.all([
          mockdata.getMockAnimal(),
          mockdata.getMockPlant()
        ]);
        setMockAnimal(animal);
        setMockPlant(plant);
      } catch (error) {
        console.error('Fehler beim Laden der Mock-Daten:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  if (loading) {
    return <div>Lädt...</div>;
  }

  return (
    <div>
      <Grid container spacing={1}>
        {mockAnimal && <AnimalCard animal={mockAnimal} />}
        {mockPlant && <PlantCard plant={mockPlant} />}
      </Grid>
    </div>
  );
};

export default SearchPage;	