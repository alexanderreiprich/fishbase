import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { InhabitantType } from '../interfaces/InhabitantType';
import './SearchForm.css';
import { SearchOptions } from '../interfaces/SearchOptions';

interface SearchFormProps {
  onSearch: (searchParams: SearchOptions) => void;
  lastSearchParams?: SearchOptions;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, lastSearchParams }) => {
  const [search, setSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [type, setType] = useState<InhabitantType | ''>('');
  const [habitat, setHabitat] = useState('');
  const [color, setColor] = useState('');
  const [salinity, setSalinity] = useState('');
  const [phValue, setPhValue] = useState('');
  const [temperature, setTemperature] = useState('');

  const typeStrings = ["fish", "invertebrate", "plant"];

  // Wiederherstellen der letzten Suchparameter
  useEffect(() => {
    if (lastSearchParams) {
      setSearch(lastSearchParams.searchText || '');
      setType(lastSearchParams.type ? 
        (lastSearchParams.type === 'fish' ? InhabitantType.FISH : 
         lastSearchParams.type === 'invertebrate' ? InhabitantType.INVERTEBRATE : 
         InhabitantType.PLANT) : '');
      setHabitat(lastSearchParams.habitat || '');
      setColor(lastSearchParams.color || '');
      setSalinity(lastSearchParams.salinity?.toString() || '');
      setPhValue(lastSearchParams.phValue?.toString() || '');
      setTemperature(lastSearchParams.temperature?.toString() || '');
      
      // Erweiterte Suche anzeigen, wenn erweiterte Parameter verwendet wurden
      if (lastSearchParams.habitat || lastSearchParams.color || 
          lastSearchParams.salinity || lastSearchParams.phValue || 
          lastSearchParams.temperature || lastSearchParams.type) {
        setShowAdvanced(true);
      }
    }
  }, [lastSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchText: search == "" ? null : search,
      type: type === "" ? null : typeStrings[type as number],
      habitat: habitat == "" ? null : habitat,
      color: color == "" ? null : color,
      salinity: salinity === '' ? null : Number(salinity),
      phValue: phValue === '' ? null : Number(phValue),
      temperature: temperature === '' ? null : Number(temperature)
    });
  };

  return (
    <Paper elevation={3} className="searchform-paper">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12}}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Suche…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <span style={{fontSize: 24, color: "white"}}>&#128269;</span>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="searchform-searchfield"
            />
          </Grid>
          <Grid size={{ xs: 12}}>
            <Typography
              variant="body2"
              className="searchform-advanced-toggle"
              onClick={() => setShowAdvanced(v => !v)}
            >
              Erweiterte Suche {showAdvanced ? 'deaktivieren' : 'aktivieren'}
            </Typography>
          </Grid>
          {showAdvanced && (
            <>
              <Grid size={{ xs: 12}}>
                <FormControl fullWidth size="small">
                  <InputLabel className="searchform-input-label">Typ</InputLabel>
                  <Select
                    value={type}
                    label="Typ"
                    onChange={e => setType(e.target.value as InhabitantType)}
                  >
                    <MenuItem value="" >Alle</MenuItem>
                    <MenuItem value={InhabitantType.FISH}>Fisch</MenuItem>
                    <MenuItem value={InhabitantType.INVERTEBRATE}>Wirbellose</MenuItem>
                    <MenuItem value={InhabitantType.PLANT}>Pflanze</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12}}>
                <TextField
                  fullWidth
                  size="small"
                  value={habitat}
                  onChange={e => setHabitat(e.target.value)}
                  placeholder="z.B. Südamerika"
                  label="Lebensraum"
                  className="searchform-text-input"
                />
              </Grid>
              <Grid size={{ xs: 12}}>
                <TextField
                  fullWidth
                  size="small"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="z.B. rot"
                  label="Farbe"
                  className="searchform-text-input"
                />
              </Grid>
              <Grid size={{ xs: 12}}>
                <Typography className="searchform-label" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                  Wasserqualität:
                </Typography>
              </Grid>
              <Grid size={{ xs: 12}}>
                <TextField
                  fullWidth
                  size="small"
                  value={salinity}
                  onChange={e => setSalinity(e.target.value)}
                  placeholder="z.B. 1.023"
                  label="Salinität"
                  className="searchform-text-input"
                  type="number"
                  inputProps={{ min: 0, max: 40, step: 0.001 }}
                />
              </Grid>
              <Grid size={{ xs: 12}}>
                <TextField
                  fullWidth
                  size="small"
                  value={phValue}
                  onChange={e => setPhValue(e.target.value)}
                  placeholder="z.B. 7.2"
                  label="pH-Wert"
                  className="searchform-text-input"
                  type="number"
                  inputProps={{ min: 4, max: 10, step: 0.01 }}
                />
              </Grid>
              <Grid size={{ xs: 12}}>
                <TextField
                  fullWidth
                  size="small"
                  value={temperature}
                  onChange={e => setTemperature(e.target.value)}
                  placeholder="z.B. 24"
                  label="Temperatur"
                  className="searchform-text-input"
                  type="number"
                  inputProps={{ min: 0, max: 40, step: 0.1 }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Paper>
  );
}; 