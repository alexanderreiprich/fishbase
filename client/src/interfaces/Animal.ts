import { Inhabitant } from "./Inhabitant";
import { InhabitantType } from "./InhabitantType";

export interface Animal extends Inhabitant {
  type: InhabitantType,
  length: number,
  food: string
}