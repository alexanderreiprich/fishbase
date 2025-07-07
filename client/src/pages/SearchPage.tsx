import { Grid, Typography, Box } from "@mui/material"
import AnimalCard from "../components/AnimalCard"
import { Animal } from "../interfaces/Animal"
import { Plant } from "../interfaces/Plant"
import { useState } from "react"
import PlantCard from "../components/PlantCard"
import { SearchForm } from "../components/SearchForm"
import { InhabitantRepository } from "../repositories/InhabitantRepository"
import { SearchOptions } from "../interfaces/SearchOptions"
import { InhabitantType } from "../interfaces/InhabitantType"

const SearchPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchParams, setLastSearchParams] = useState<
    SearchOptions | undefined
  >(undefined)

  const handleSearch = async (searchParams: SearchOptions) => {
    setLoading(true)
    setHasSearched(true)
    setLastSearchParams(searchParams)
    const repository = InhabitantRepository.getInstance()
    const data = await repository.getInhabitants(searchParams)

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
    setLoading(false)
  }

  if (loading) {
    return <div>Lädt...</div>
  }

  return (
    <Box sx={{ p: 3 }}>
      <SearchForm onSearch={handleSearch} lastSearchParams={lastSearchParams} />

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
                <AnimalCard animal={animal} />
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
                <PlantCard plant={plant} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  )
}

export default SearchPage
