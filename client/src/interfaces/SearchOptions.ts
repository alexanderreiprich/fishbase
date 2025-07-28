export type Colors = {
  rot: boolean
  orange: boolean
  gelb: boolean
  grün: boolean
  blau: boolean
  silber: boolean
  schwarz: boolean
  weiß: boolean
  braun: boolean
  bunt: boolean
}

export interface SearchOptions {
  searchText: string | null
  type: string | null
  habitat: string | null
  salinity: number | null
  phValue: number[]
  temperature: number[]
  colors: string[]
}
