import { Box, Typography, Alert, TextField, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AquariumRepository } from "../repositories/AquariumRepository";
import { useAuth } from "../context/AuthContext";
import { Aquarium } from "../interfaces/Aquarium";

export default function UpdateAquariumForm() {
	const { user } = useAuth();
	const [formError, setFormError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
  const [chosenAquarium, setChosenAquarium] = useState<Aquarium | null>(null);
	const [allAquariums, setAllAquariums] = useState<Aquarium[] | null>(null);
	const navigate = useNavigate();
	const repository = AquariumRepository.getInstance();

  // Beim Laden der Komponente alle Aquarien des Nutzers abrufen
	useEffect(() => {
		if (user) {
			fetchAquariums();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
		setLoading(true);
    try {
			navigate("/add");
    } catch (error) {
      setFormError("Etwas ist schiefgelaufen, bitte versuche es erneut.")
    }
  }

  const fetchAquariums = async () => {
		setLoading(true);
		try {
			const aquariums = await repository.getAquariumsOfUser(user!.id);
			setAllAquariums(aquariums);
		} catch (error) {
			console.error("Fehler beim Abrufen der Aquarien:", error);
		} finally {
			setLoading(false);
		}
	}

  const handleAquariumChange = (event: any) => {
		const aquariumId = event.target.value;
		const selectedAquarium = allAquariums?.find(aquarium => aquarium.id === aquariumId) || null;
		setChosenAquarium(selectedAquarium);
	};

	return (
		<Box component="form" className="login-form" sx={{ borderColor: 'var(--primary-main)', p: 2, borderWidth: 2, borderStyle: 'solid' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Aquarium aktualisieren
      </Typography>

      {formError && <Alert severity="error">{formError}</Alert>}

      <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="aquarium-select-label">Aquarium auswählen</InputLabel>
          <Select
            labelId="aquarium-select-label"
            id="aquarium-select"
            value={chosenAquarium?.id || ''}
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
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Aquarium auswählen"}
          </Button>
        </FormControl>
    </Box>
	);
}