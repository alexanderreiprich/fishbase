import { Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import AnimalCard from "../components/AnimalCard"
import { Animal } from "../interfaces/Animal"
import { Plant } from "../interfaces/Plant"
import { useState, useEffect, useMemo } from "react"
import PlantCard from "../components/PlantCard"
import { SearchForm } from "../components/SearchForm"
import { InhabitantRepository } from "../repositories/InhabitantRepository"
import { SearchOptions } from "../interfaces/SearchOptions"
import { InhabitantType } from "../interfaces/InhabitantType"
import { Aquarium } from "../interfaces/Aquarium"
import { AquariumRepository } from "../repositories/AquariumRepository"
import { useAuth } from "../context/AuthContext"

const AddInhabitantsPage: React.FC = () => {
	const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([])
  const [plants, setPlants] = useState<Plant[]>([])
	const [predatorConflicts, setPredatorConflicts] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchParams, setLastSearchParams] = useState<SearchOptions | undefined>(undefined)
	const [chosenAquariumId, setChosenAquariumId] = useState<number | null>(null);
	const [allAquariums, setAllAquariums] = useState<Aquarium[] | null>(null);
	const aquariumRepository = AquariumRepository.getInstance();
	const inhabitantRepository = InhabitantRepository.getInstance();

	// Das aktuelle Aquarium wird automatisch aktualisiert, wenn sich allAquariums ändert
	const chosenAquarium = useMemo(() => {
		if (!chosenAquariumId || !allAquariums) return null;
		return allAquariums.find(aquarium => aquarium.id === chosenAquariumId) || null;
	}, [chosenAquariumId, allAquariums]);

	// Beim Laden der Komponente alle Aquarien des Nutzers abrufen
	useEffect(() => {
		if (user) {
			fetchAquariums();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const fetchAquariums = async () => {
		setLoading(true);
		try {
			const aquariums = await aquariumRepository.getAquariumsOfUser(user!.id);
			setAllAquariums(aquariums);
		} catch (error) {
			console.error("Fehler beim Abrufen der Aquarien:", error);
		} finally {
      await checkPredatorConflicts();
			setLoading(false);
		}
	}

	const handleAquariumChange = (event: any) => {
		const aquariumId = event.target.value;
		setChosenAquariumId(aquariumId);
	};

	const handleAddToAquarium = async (inhabitantId: number, quantity: number) => {
		if (!chosenAquarium) {
			alert('Bitte wählen Sie zuerst ein Aquarium aus');
			return;
		}

		try {
			setLoading(true);
			await aquariumRepository.addInhabitantToAquarium(chosenAquarium.id, inhabitantId, quantity);
			
			// Erfolgsmeldung
			alert(`${quantity} Inhabitant(s) wurden erfolgreich zum Aquarium hinzugefügt!`);

      // Aquarium-Daten aktualisieren
			await fetchAquariums();
		} catch (error) {
			console.error('Fehler beim Hinzufügen des Inhabitants:', error);
			alert('Fehler beim Hinzufügen des Inhabitants');
		} finally {
			setLoading(false);
		}
	};

  const handleSearch = async (searchParams: SearchOptions) => {
    setLoading(true);
    setHasSearched(true);
    setLastSearchParams(searchParams);
    const data = await inhabitantRepository.getInhabitants(searchParams);

    let animals: Animal[] = []
    let plants: Plant[] = []

    for (let i = 0; i < data.length; i++) {
      switch (data[i].type) {
        case InhabitantType.FISH:
        case InhabitantType.INVERTEBRATE:
          animals.push(data[i] as Animal)
          break
        case InhabitantType.PLANT:
          plants.push(data[i] as Plant)
          break
        default:
          break
      }
    }

    setAnimals(animals)
    setPlants(plants)
    await checkPredatorConflicts();
    setLoading(false)
  }	

  const checkPredatorConflicts = async () => {
    if (chosenAquarium && chosenAquarium.inhabitants.length > 0) {
			const aquariumInhabitantIds = chosenAquarium.inhabitants.map(i => i.id);
			const predatorConflicts: Animal[] = [];
		
			for (const animal of animals) {
				const predators = await inhabitantRepository.getPredatorsForInhabitant(animal.id);
				const isHunted = predators.some(pred => aquariumInhabitantIds.includes(pred.id));
		
				const victims = await inhabitantRepository.getVictimsForInhabitant(animal.id);
				const isHunter = victims.some(victim => aquariumInhabitantIds.includes(victim.id));
		
				if (isHunted || isHunter) {
					predatorConflicts.push(animal);
				}
			}
			setPredatorConflicts(predatorConflicts);
		} else {
			setPredatorConflicts([]);
		}
  }

  if (loading) {
    return <div>Lädt...</div>
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Aquarienauswahl */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Inhabitant zu Aquarium hinzufügen
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="aquarium-select-label">Aquarium auswählen</InputLabel>
          <Select
            labelId="aquarium-select-label"
            id="aquarium-select"
            value={chosenAquariumId || ''}
            label="Aquarium auswählen"
            onChange={handleAquariumChange}
            sx={{
              '& .MuiSelect-icon': {
                color: 'white',
              },
            }}
          >
            {allAquariums?.map((aquarium) => (
              <MenuItem key={aquarium.id} value={aquarium.id}>
                {aquarium.name} (Kapazität: {aquarium.capacity}L)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {chosenAquarium && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Ausgewähltes Aquarium: {chosenAquarium.inhabitants.length} Inhabitant(s)
          </Typography>
        )}
      </Box>

      {/* Suchformular nur anzeigen wenn ein Aquarium ausgewählt ist */}
      {chosenAquarium && (
        <SearchForm onSearch={handleSearch} lastSearchParams={lastSearchParams} />
      )}

      {!chosenAquarium && allAquariums && allAquariums.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Bitte wählen Sie zuerst ein Aquarium aus
          </Typography>
        </Box>
      )}

      {!chosenAquarium && allAquariums && allAquariums.length === 0 && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Sie haben noch keine Aquarien erstellt
          </Typography>
          <Typography variant="body1">
            Erstellen Sie zuerst ein Aquarium, bevor Sie Inhabitant hinzufügen können.
          </Typography>
        </Box>
      )}

      {hasSearched && animals.length === 0 && plants.length === 0 && (
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
                <AnimalCard animal={animal} onAddToAquarium={handleAddToAquarium} isPredatorConflict={predatorConflicts.includes(animal)} />
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
                <PlantCard plant={plant} onAddToAquarium={handleAddToAquarium} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  )
}

export default AddInhabitantsPage