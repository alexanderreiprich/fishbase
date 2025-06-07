import { Animal } from "./Animal";
import { Habitat } from "./Habitat";

export interface Inhabitant {
  name: string,
  latinName: string,
  habitat: Habitat,
  color: string,
  predators: Animal[],
  image: Blob
}