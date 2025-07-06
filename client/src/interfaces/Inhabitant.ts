import { Animal } from "./Animal";
import { Habitat } from "./Habitat";

export interface Inhabitant {
  id: number,
  name: string,
  latinName: string,
  habitat: Habitat,
  color: string,
  predators: Animal[],
  image: Blob
}