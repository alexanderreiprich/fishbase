import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  Typography, 
  Box, 
  IconButton,
  CircularProgress
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import AnimalCard from "./AnimalCard";
import PlantCard from "./PlantCard";
import { Animal } from "../interfaces/Animal";
import { Plant } from "../interfaces/Plant";
import { SearchForm } from "./SearchForm";
import { InhabitantRepository } from "../repositories/InhabitantRepository";
import { SearchOptions } from "../interfaces/SearchOptions";
import { InhabitantType } from "../interfaces/InhabitantType";

interface AddInhabitantsDialogProps {
  open: boolean;
  onClose: () => void;
  onAddInhabitant: (inhabitantId: number, quantity: number) => void;
  aquariumId: number;
  existingInhabitants: { id: number, name: string, quantity: number }[];
}

export default function AddInhabitantsDialog({
  open,
  onClose,
  onAddInhabitant,
  aquariumId,
  existingInhabitants
}: AddInhabitantsDialogProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [predatorConflicts, setPredatorConflicts] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState<SearchOptions | undefined>(undefined);
  
  const inhabitantRepository = InhabitantRepository.getInstance();

  const handleSearch = async (searchParams: SearchOptions) => {
    setLoading(true);
    setHasSearched(true);
    setLastSearchParams(searchParams);
    
    try {
      const data = await inhabitantRepository.getInhabitants(searchParams);

      let animals: Animal[] = [];
      let plants: Plant[] = [];

      for (let i = 0; i < data.length; i++) {
        switch (data[i].type) {
          case InhabitantType.FISH:
          case InhabitantType.INVERTEBRATE:
            animals.push(data[i] as Animal);
            break;
          case InhabitantType.PLANT:
            plants.push(data[i] as Plant);
            break;
          default:
            break;
        }
      }
      await checkPredatorConflicts(animals);
      setAnimals(animals);
      setPlants(plants);
    } catch (error) {
      console.error("Fehler bei der Suche:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPredatorConflicts = async (animals: Animal[]) => {
    if (existingInhabitants.length > 0) {
      const aquariumInhabitantIds = existingInhabitants.map(i => i.id);
      const predatorConflicts: Animal[] = [];

      for (const animal of animals) {
        try {
          const predators = await inhabitantRepository.getPredatorsForInhabitant(animal.id);
          const isHunted = predators.some(pred => aquariumInhabitantIds.includes(pred.id));

          const victims = await inhabitantRepository.getVictimsForInhabitant(animal.id);
          const isHunter = victims.some(victim => aquariumInhabitantIds.includes(victim.id));

          if (isHunted || isHunter) {
            predatorConflicts.push(animal);
          }
        } catch (error) {
          console.error("Fehler beim Prüfen der Fressverhältnisse:", error);
        }
      }
      setPredatorConflicts(predatorConflicts);
    } else {
      setPredatorConflicts([]);
    }
  };

  const handleAddToAquarium = async (inhabitantId: number, quantity: number) => {
    try {
      onAddInhabitant(inhabitantId, quantity);
      onClose();
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Inhabitants:', error);
    }
  };

  const handleClose = () => {
    setAnimals([]);
    setPlants([]);
    setPredatorConflicts([]);
    setHasSearched(false);
    setLastSearchParams(undefined);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Bewohner hinzufügen</Typography>
          <IconButton onClick={handleClose} size="small" color="primary">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <SearchForm onSearch={handleSearch} lastSearchParams={lastSearchParams} />

        {loading && (
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {hasSearched && animals.length === 0 && plants.length === 0 && !loading && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Keine Ergebnisse gefunden.
            </Typography>
            <Typography variant="body1">
              Versuchen Sie andere Suchkriterien oder erweitern Sie Ihre Suche.
            </Typography>
          </Box>
        )}

        {animals.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Gefundene Tiere
            </Typography>
            <Grid container spacing={3}>
              {animals.map((animal, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <AnimalCard 
                    animal={animal} 
                    onAddToAquarium={handleAddToAquarium} 
                    isPredatorConflict={predatorConflicts.includes(animal)} 
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {plants.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Gefundene Pflanzen
            </Typography>
            <Grid container spacing={3}>
              {plants.map((plant, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <PlantCard 
                    plant={plant} 
                    onAddToAquarium={handleAddToAquarium} 
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 