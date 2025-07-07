import { useState } from "react"
import { User } from "../interfaces/User"
import { UserRepository } from "../repositories/UserRepository"
import { SearchOptions } from "../interfaces/SearchOptions"
import { Box, Grid, Typography } from "@mui/material"
import { UserSearchForm } from "../components/UserSearchForm"
import UserCard from "../components/UserCard"

const CommunityPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchParams] = useState<SearchOptions | undefined>(undefined)

  const handleSearch = async (searchOptions: SearchOptions) => {
    setLoading(true)
    setHasSearched(true)

    const repository = UserRepository.getInstance()
    const data = await repository.getUsers(searchOptions)

    setUsers(data)
    setLoading(false)
  }

  if (loading) {
    return <div>Lädt...</div>
  }

  return (
    <Box sx={{ p: 3 }}>
      <UserSearchForm
        onSearch={handleSearch}
        lastSearchParams={lastSearchParams}
      />

      {hasSearched && users.length === 0 && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Keine Ergebnisse gefunden.
          </Typography>
          <Typography variant="body1">
            Es scheint keine User mit diesem Namen zu geben.
          </Typography>
        </Box>
      )}

      {users.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Gefundene User
          </Typography>
          <Grid container spacing={3}>
            {users.map((user, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <UserCard user={user} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  )
}

export default CommunityPage
