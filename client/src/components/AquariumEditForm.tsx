import {
  Box,
  Typography,
  Alert,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Aquarium } from "../interfaces/Aquarium";
import { Inhabitant } from "../interfaces/Inhabitant";
import { AquariumRepository } from "../repositories/AquariumRepository";
import { InhabitantRepository } from "../repositories/InhabitantRepository";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddInhabitantsDialog from "./AddInhabitantsDialog";
import { AquariumQuantity } from "../interfaces/AquariumQuantity";

export default function AquariumEditForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const repository = AquariumRepository.getInstance();
  const inhabitantRepository = InhabitantRepository.getInstance();

  const aquarium: Aquarium | undefined = location.state?.aquarium;
  const [name, setName] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [waterQualityId, setWaterQualityId] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Separate Verwaltung von Inhabitants und ihren Quantities
  const [inhabitants, setInhabitants] = useState<Inhabitant[]>(
    aquarium?.inhabitants || []
  );
  const [inhabitantQuantities, setInhabitantQuantities] = useState<AquariumQuantity[] | []>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInhabitantId, setSelectedInhabitantId] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);

  // Add Inhabitants Dialog state
  const [addInhabitantsDialogOpen, setAddInhabitantsDialogOpen] =
    useState(false);


  const handleRemove = (id: number) => {
    setInhabitants((prev) => prev.filter((i) => i.id !== id));
    setInhabitantQuantities((prev) => prev.filter((item, index) => index !== id));
  };

  const handleEditQuantity = (inhabitantId: number) => {
    setSelectedInhabitantId(inhabitantId);
    setNewQuantity(inhabitantQuantities.find((i) => i.inhabitantId === inhabitantId)?.amount || 1);
    setDialogOpen(true);
  };

  const handleSaveQuantity = () => {
    if (selectedInhabitantId) {
      setInhabitantQuantities((prev) => {
        const newArray = [...prev];
        const entry = newArray.find((i) => i.inhabitantId === selectedInhabitantId);
        entry!.amount = newQuantity;
        return newArray;
      });
    }
    setDialogOpen(false);
    setSelectedInhabitantId(null);
  };

  const handleCancelQuantity = () => {
    setDialogOpen(false);
    setSelectedInhabitantId(null);
  };

  const handleAddInhabitant = async (
    inhabitantId: number,
    quantity: number
  ) => {
    try {
      // Inhabitant-Daten vom Server abrufen
      const inhabitant = await inhabitantRepository.getInhabitantById(
        inhabitantId
      );

      // Prüfen ob der Inhabitant bereits existiert
      const existingInhabitant = inhabitants.find((i) => i.id === inhabitantId);
      if (existingInhabitant) {
        // Wenn bereits vorhanden, nur die Quantity aktualisieren
        setInhabitantQuantities(prev => 
          prev.map(item => 
            item.inhabitantId === inhabitantId 
              ? { ...item, amount: (item.amount || 0) + quantity }
              : item
          )
        );
      } else {
        // Neuen Inhabitant hinzufügen
        setInhabitants((prev) => [...prev, inhabitant]);
        setInhabitantQuantities((prev) => {
          const newArray = [...prev];
          newArray.push({amount: quantity, inhabitantId: inhabitantId, tankId: aquarium!.id});
          return newArray;
        });
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Inhabitant-Daten:", error);
      setFormError("Fehler beim Hinzufügen des Bewohners.");
    }
  };

  const handleOpenAddInhabitantsDialog = () => {
    setAddInhabitantsDialogOpen(true);
  };

  const handleCloseAddInhabitantsDialog = () => {
    setAddInhabitantsDialogOpen(false);
  };

  useEffect(() => {
    if (aquarium) {
      setName(aquarium.name);
      setCapacity(aquarium.capacity);
      setWaterQualityId(aquarium.waterQualityId);
      
      const loadInhabitants = async () => {
        const inhabitants = await repository.getAmountOfInhabitants(aquarium.id);
        setInhabitantQuantities(inhabitants);
      };
      
      loadInhabitants();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aquarium]);

  useEffect(() => {
    if (!aquarium) {
      navigate("/");
    }
  }, [aquarium, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      await repository.updateAquarium(
        {
          ...aquarium!,
          name,
          waterQualityId,
          capacity,
        },
        inhabitants.map((inhabitant) => ({
          ...inhabitant,
          quantity: inhabitantQuantities.find((i) => i.inhabitantId === inhabitant.id)?.amount || 1,
        }))
      );
      navigate(-1);
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
      sx={{
        borderColor: "var(--primary-main)",
        p: 2,
        borderWidth: 2,
        borderStyle: "solid",
        maxWidth: 400,
        margin: "0 auto",
        mt: 2,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Aquarium bearbeiten
      </Typography>

      {formError && <Alert severity="error">{formError}</Alert>}

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Kapazität (Liter)"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
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
        {inhabitants.map((inhabitant) => (
          <ListItem key={inhabitant.id}>
            <ListItemText
              primary={`${inhabitant.name} (${
                inhabitantQuantities.find((i) => i.inhabitantId === inhabitant.id)?.amount || 1
              }x)`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                color="primary"
                onClick={() => handleEditQuantity(inhabitant.id)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRemove(inhabitant.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="secondary"
        disabled={loading}
        sx={{ mt: 2 }}
        fullWidth
        onClick={handleOpenAddInhabitantsDialog}
      >
        Bewohner hinzufügen
      </Button>

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

      {/* Quantity Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancelQuantity}>
        <DialogTitle>Anzahl ändern</DialogTitle>
        <DialogContent>
          <TextField
            label="Neue Anzahl"
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
            fullWidth
            autoFocus
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelQuantity}>Abbrechen</Button>
          <Button onClick={handleSaveQuantity} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Inhabitants Dialog */}
      <AddInhabitantsDialog
        open={addInhabitantsDialogOpen}
        onClose={handleCloseAddInhabitantsDialog}
        onAddInhabitant={handleAddInhabitant}
        aquariumId={aquarium?.id || 0}
        existingInhabitants={inhabitants.map((inhabitant) => ({
          id: inhabitant.id,
          name: inhabitant.name,
          quantity: inhabitantQuantities.find((i) => i.inhabitantId === inhabitant.id)?.amount || 1,
        }))}
      />
    </Box>
  );
}
