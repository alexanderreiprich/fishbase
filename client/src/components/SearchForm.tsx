import React, { useState, useEffect } from "react"
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
  Slider,
  Chip,
  OutlinedInput,
} from "@mui/material"
import { InhabitantType } from "../interfaces/InhabitantType"
import "../style/SearchForm.css"
import { SearchOptions } from "../interfaces/SearchOptions"

interface SearchFormProps {
  onSearch: (searchParams: SearchOptions) => void
  lastSearchParams?: SearchOptions
}

const salinityMarks = [
  {
    value: 0,
    label: "0",
  },
]
const temperatureMarks = [
  {
    value: 20,
    label: "20°C",
  },
  {
    value: 25,
    label: "25°C",
  },
  {
    value: 30,
    label: "30°C",
  },
]
const phMarks = [
  {
    value: 5,
    label: "5",
  },
  {
    value: 7,
    label: "7",
  },
  {
    value: 9,
    label: "9",
  },
]

const initialColors = {
  rot: false,
  orange: false,
  gelb: false,
  grün: false,
  blau: false,
  silber: false,
  schwarz: false,
  weiß: false,
  braun: false,
  bunt: false,
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  lastSearchParams,
}) => {
  const [search, setSearch] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [type, setType] = useState<InhabitantType | "">("")
  const [habitat, setHabitat] = useState("")
  const [salinity, setSalinity] = useState<number>(0)
  const [phValue, setPhValue] = useState<number[]>([0, 5])
  const [temperature, setTemperature] = useState<number[]>([0, 5])
  const [selectedColors, setSelectedColors] = React.useState<string[]>([])

  const typeStrings = ["fish", "invertebrate", "plant"]

  // Wiederherstellen der letzten Suchparameter
  useEffect(() => {
    if (lastSearchParams) {
      setSearch(lastSearchParams.searchText || "")
      setType(
        lastSearchParams.type
          ? lastSearchParams.type === "fish"
            ? InhabitantType.FISH
            : lastSearchParams.type === "invertebrate"
            ? InhabitantType.INVERTEBRATE
            : InhabitantType.PLANT
          : ""
      )
      setHabitat(lastSearchParams.habitat || "")
      setSalinity(lastSearchParams.salinity || 0)
      setPhValue(lastSearchParams.phValue || [0, 5])
      setTemperature(lastSearchParams.temperature || [0, 5])
      setSelectedColors(lastSearchParams.colors || [])
      // Erweiterte Suche anzeigen, wenn erweiterte Parameter verwendet wurden
      if (
        lastSearchParams.habitat ||
        lastSearchParams.salinity ||
        lastSearchParams.phValue ||
        lastSearchParams.temperature ||
        lastSearchParams.type ||
        lastSearchParams.colors
      ) {
        setShowAdvanced(true)
      }
    }
  }, [lastSearchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      searchText: search === "" ? null : search,
      type: type === "" ? null : typeStrings[type as number],
      habitat: habitat === "" ? null : habitat,
      salinity: !salinity ? 0 : salinity,
      phValue: !phValue.length ? [0, 1] : phValue,
      temperature: !temperature.length ? [0, 1] : temperature,
      colors: selectedColors,
    })
  }

  const handleColorChange = (event: any) => {
    const {
      target: { value },
    } = event
    setSelectedColors(
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  return (
    <Paper elevation={3} className="searchform-paper">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Suche…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <span style={{ fontSize: 24, color: "white" }}>
                        &#128269;
                      </span>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="searchform-searchfield"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              className="searchform-advanced-toggle"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              Erweiterte Suche {showAdvanced ? "deaktivieren" : "aktivieren"}
            </Typography>
          </Grid>
          {showAdvanced && (
            <>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel className="searchform-input-label">
                    Typ
                  </InputLabel>
                  <Select
                    value={type}
                    label="Typ"
                    onChange={(e) => setType(e.target.value as InhabitantType)}
                  >
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value={InhabitantType.FISH}>Fisch</MenuItem>
                    <MenuItem value={InhabitantType.INVERTEBRATE}>
                      Wirbellose
                    </MenuItem>
                    <MenuItem value={InhabitantType.PLANT}>Pflanze</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={habitat}
                  onChange={(e) => setHabitat(e.target.value)}
                  placeholder="z.B. Südamerika"
                  label="Lebensraum"
                  className="searchform-text-input"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel className="searchform-input-label">
                    Farben
                  </InputLabel>
                  <Select
                    multiple
                    value={selectedColors}
                    onChange={handleColorChange}
                    input={<OutlinedInput label="Farben" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value.substring(0, 1).toUpperCase() + value.substring(1)} sx={{ backgroundColor: 'var(--primary-main)'}} />
                        ))}
                      </Box>
                    )}
                  >
                    {Object.keys(initialColors).map((color) => (
                      <MenuItem key={color} value={color}>
                        {color.substring(0, 1).toUpperCase() + color.substring(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography
                  className="searchform-label"
                  style={{ marginBottom: "8px", fontWeight: "bold" }}
                >
                  Wasserqualität:
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography
                  className="searchform-label"
                  style={{ marginBottom: "8px", fontWeight: "regular" }}
                >
                  Salinität:
                </Typography>
                <Slider
                  disabled //DB only contains fish with 0 salinity by now
                  getAriaLabel={() => "Salinity"}
                  value={salinity}
                  onChange={(_e, newValue: number) => {
                    return setSalinity(newValue)
                  }}
                  valueLabelDisplay="auto"
                  marks={salinityMarks}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography
                  className="searchform-label"
                  style={{ marginBottom: "8px", fontWeight: "regular" }}
                >
                  PH-Wert:
                </Typography>
                <Slider
                  min={5}
                  max={9}
                  getAriaLabel={() => "Ph range"}
                  value={phValue}
                  onChange={(_e, newValue: number[]) => setPhValue(newValue)}
                  valueLabelDisplay="auto"
                  step={0.5}
                  marks={phMarks}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography
                  className="searchform-label"
                  style={{ marginBottom: "8px", fontWeight: "regular" }}
                >
                  Temperatur:
                </Typography>
                <Slider
                  min={20}
                  max={30}
                  getAriaLabel={() => "Temperature range"}
                  value={temperature}
                  onChange={(_e, newValue: number[]) =>
                    setTemperature(newValue)
                  }
                  valueLabelDisplay="auto"
                  marks={temperatureMarks}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Paper>
  )
}
