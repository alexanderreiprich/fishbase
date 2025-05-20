import { Inhabitant } from "./Inhabitant";

export interface Plant extends Inhabitant {
  minHeight: number,
  maxHeight: number
}