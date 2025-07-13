import { Box, Typography, Alert, TextField, Button, CircularProgress } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { AquariumRepository } from "../repositories/AquariumRepository";
import { useAuth } from "../context/AuthContext";

export default function CreateAquariumForm() {
	const { user } = useAuth();
	const [formError, setFormError] = useState<string | null>(null);
  const [aquariumName, setAquariumName] = useState("");
	const [capacity, setCapacity] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();
	const repository = AquariumRepository.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
		setLoading(true);
    try {
			repository.createAquarium(user!.id, capacity!, aquariumName);
			navigate("/add");
    } catch (error) {
      setFormError("Etwas ist schiefgelaufen, bitte versuche es erneut.")
    }
  }

	return (
		<Box component="form" onSubmit={handleSubmit} className="login-form">
      <Typography variant="h5" component="h2" gutterBottom>
        Aquarium erstellen
      </Typography>

      {formError && <Alert severity="error">{formError}</Alert>}

      <TextField
        label="Name des Aquariums"
        type="text"
        value={aquariumName}
        onChange={(e) => setAquariumName(e.target.value)}
        fullWidth
				required
      />

      <TextField
        label="Fassungsvermögen"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
        fullWidth
				required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Aquarium erstellen"}
      </Button>
    </Box>
	);

}