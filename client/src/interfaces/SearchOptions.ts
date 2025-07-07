export interface SearchOptions {
  searchText: string | null
  type: string | null
  habitat: string | null
  color: string | null
  salinity: number | null
  phValue: number[]
  temperature: number[]
}
