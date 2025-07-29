import { Box, Typography, Alert, TextField, Button, CircularProgress, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Aquarium } from "../interfaces/Aquarium";
import { AquariumRepository } from "../repositories/AquariumRepository";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AquariumEditForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const repository = AquariumRepository.getInstance();

  const aquarium: Aquarium | undefined = location.state?.aquarium;
  const [name, setName] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [inhabitants, setInhabitants] = useState<{ id: number, name: string }[]>(aquarium?.inhabitants || []);

  const handleRemove = (id: number) => {
    setInhabitants(prev => prev.filter(i => i.id !== id));
  };

  useEffect(() => {
    if (aquarium) {
      setName(aquarium.name);
      setCapacity(aquarium.capacity);
    }
  }, [aquarium]);

  useEffect(() => {
    if (!aquarium) {
      navigate("/"); // oder eine andere sinnvolle Seite
    }
  }, [aquarium, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      // await repository.updateAquarium({
      //   ...aquarium!,
      //   name,
      //   capacity,
      // });
      navigate(-1); // Zurück zur vorherigen Seite
    } catch (error) {
      setFormError("Fehler beim Aktualisieren des Aquariums.");
    } finally {
      setLoading(false);
    }
  };

  if (!aquarium) return null;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ borderColor: 'var(--primary-main)', p: 2, borderWidth: 2, borderStyle: 'solid', maxWidth: 400, margin: '0 auto', mt: 2 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Aquarium bearbeiten
      </Typography>

      {formError && <Alert severity="error">{formError}</Alert>}

      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Kapazität (Liter)"
        type="number"
        value={capacity}
        onChange={e => setCapacity(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
        inputProps={{ min: 1 }}
      />

      <Typography variant="h6" sx={{ mt: 3 }}>
        Bewohner
      </Typography>
      {inhabitants.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Keine Bewohner im Aquarium.
        </Typography>
      )}
      <List>
        {inhabitants.map(inhabitant => (
          <ListItem key={inhabitant.id}>
            <ListItemText
              primary={inhabitant.name + " (5" + "x)"}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" color="error" onClick={() => handleRemove(inhabitant.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={false} onClose={() => {}}>
        <DialogTitle>Anzahl ändern</DialogTitle>
        <DialogContent>
          <TextField
            label="Neue Anzahl"
            type="number"
            value={1} 
            onChange={() => {}}
            inputProps={{ min: 1 }}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Abbrechen</Button>
          <Button onClick={() => {}} variant="contained">Speichern</Button>
        </DialogActions>
      </Dialog>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : "Speichern"}
      </Button>
    </Box>
  );
}