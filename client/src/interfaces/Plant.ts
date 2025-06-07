import { Inhabitant } from "./Inhabitant";
import { InhabitantType } from "./InhabitantType";

export interface Plant extends Inhabitant {
  minHeight: number,
  maxHeight: number,
  type: InhabitantType
}