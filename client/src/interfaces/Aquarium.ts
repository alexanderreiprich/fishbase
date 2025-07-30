import { Inhabitant } from "./Inhabitant"

export interface Aquarium {
	id: number,
	userId: number,
	waterQualityId: number,
	capacity: number,
	name: string,
	inhabitants: Inhabitant[]
}