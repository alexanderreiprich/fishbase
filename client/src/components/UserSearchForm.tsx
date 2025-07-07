import React, { useState, useEffect } from "react"
import {
  Box,
  Paper,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material"
import "../style/SearchForm.css"
import { SearchOptions } from "../interfaces/SearchOptions"

interface UserSearchFormProps {
  onSearch: (searchParams: SearchOptions) => void
  lastSearchParams?: SearchOptions
}

export const UserSearchForm: React.FC<UserSearchFormProps> = ({
  onSearch,
  lastSearchParams,
}) => {
  const [search, setSearch] = useState("")

  // Wiederherstellen der letzten Suchparameter
  useEffect(() => {
    if (lastSearchParams) {
      setSearch(lastSearchParams.searchText || "")
    }
  }, [lastSearchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      searchText: search === "" ? null : search,
      type: null,
      habitat: null,
      color: null,
      salinity: null,
      phValue: null,
      temperature: null,
    })
  }

  return (
    <Paper elevation={3} className="searchform-paper">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Suche nach User…"
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
        </Grid>
      </Box>
    </Paper>
  )
}
