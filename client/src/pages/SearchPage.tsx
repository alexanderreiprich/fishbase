import { Grid, Typography, Box } from "@mui/material";
import AnimalCard from "../components/AnimalCard";
import { Animal } from "../interfaces/Animal";
import { Plant } from "../interfaces/Plant";
import { MockData } from "../data/mockdata";
import { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";
import { SearchForm } from "../components/SearchForm";
import { InhabitantRepository } from "../repositories/InhabitantRepository";
import { SearchOptions } from "../interfaces/SearchOptions";
import { InhabitantType } from "../interfaces/InhabitantType";

const SearchPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = async () => {
      try {
        const mockdata = new MockData();
        const [animal, plant] = await Promise.all([
          mockdata.getMockAnimal(),
          mockdata.getMockPlant()
        ]);
        setAnimals([animal]);
        setPlants([plant]);
      } catch (error) {
        console.error('Fehler beim Laden der Mock-Daten:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  const handleSearch = async (searchParams: SearchOptions) => {
    // Hier würde normalerweise die API-Abfrage stattfinden
    console.log('Suchparameter:', searchParams);

    const repository = InhabitantRepository.getInstance();
    const data = await repository.getInhabitants(searchParams);

    let animals: Animal[] = [];
    let plants: Plant[] = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].type == InhabitantType.FISH || data[i].type == InhabitantType.INVERTEBRATE) {
        animals.push(data[i] as Animal);
      }
      else {
        plants.push(data[i] as Plant);
      }
    }

    setAnimals(animals);
    setPlants(plants);

    console.log(animals);
    console.log(plants);
  };

  if (loading) {
    return <div>Lädt...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <SearchForm onSearch={handleSearch} />
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Gefundene Tiere
      </Typography>
      <Grid container spacing={3}>
        {animals.map((animal, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <AnimalCard animal={animal} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Gefundene Pflanzen
      </Typography>
      <Grid container spacing={3}>
        {plants.map((plant, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <PlantCard plant={plant} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchPage;	