import { InhabitantType } from "./InhabitantType";

export interface SearchOptions {
	searchText: string | null,
	type: string | null,
	habitat: string | null,
	color: string | null,
	salinity: number | null,
	phValue: number | null,
	temperature: number | null
}