import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import { Animal } from "../interfaces/Animal";
import { Plant } from "../interfaces/Plant";
import { InhabitantType } from "../interfaces/InhabitantType";

interface QuantityModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  inhabitant: Animal | Plant | null;
}

export default function QuantityModal({
  open,
  onClose,
  onConfirm,
  inhabitant,
}: QuantityModalProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const handleConfirm = () => {
    if (quantity > 0) {
      onConfirm(quantity);
      setQuantity(1); // Reset für nächstes Modal
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1); // Reset
    onClose();
  };

  const getInhabitantType = () => {
    if (!inhabitant) return "";
    if ("length" in inhabitant) {
      return inhabitant.type === InhabitantType.FISH ? "Fisch" : "Wirbellose";
    } else {
      return "Pflanze";
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Menge auswählen</Typography>
          <IconButton onClick={handleClose} size="small" color="primary">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {inhabitant && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {inhabitant.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {inhabitant.latinName}
            </Typography>
            <Typography variant="body2">
              Typ: {getInhabitantType()}
            </Typography>
          </Box>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          label="Anzahl"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > 0) {
              setQuantity(value);
            }
          }}
          inputProps={{
            min: 1,
            max: 100,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Abbrechen
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          disabled={quantity <= 0}
        >
          Hinzufügen ({quantity})
        </Button>
      </DialogActions>
    </Dialog>
  );
} 