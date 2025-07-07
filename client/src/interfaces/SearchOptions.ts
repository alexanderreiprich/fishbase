export interface SearchOptions {
  searchText: string | null
  type: string | null
  habitat: string | null
  color: string | null
  salinity: number[]
  phValue: number[]
  temperature: number[]
}
