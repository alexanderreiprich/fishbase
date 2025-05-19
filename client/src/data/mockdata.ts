import { Animal } from "../interfaces/Animal";
import { InhabitantType } from "../interfaces/InhabitantType";
import { Plant } from "../interfaces/Plant";

export class MockData {
  public getMockAnimal(): Animal {
    const x: Animal = {
      type: InhabitantType.FISH,
      length: 213,
      food: "cheeseburger",
      name: "Blubbifisch",
      latinName: "blubbius blobbi",
      habitat: {
        region: "Südamerika",
        waterQuality: {
          salinity: 1.0003,
          temperature: 27,
          ph: 5
        }
      },
      color: "white",
      predators: [],
      image: "https://cdn.britannica.com/34/240534-050-B8C4B11E/Porcupine-fish-Diodon-hystox.jpg"
    };
    return x;
  }

  public getMockPlant(): Plant {
    const x: Plant = {
      minHeight: 23,
      maxHeight: 23,
      name: "pflanzli",
      latinName: "planticus pflanzius",
      habitat: {
        region: "Nordamerika",
        waterQuality: {
          salinity: 1.048,
          temperature: 20,
          ph: 5
        }
      },
      color: "green",
      predators: [],
      image: "https://www.aquarienpflanzen-shop.de/media/image/product/588/md/pflanzenbox-xl-22-toepfe-aquarienpflanzen-mutterpflanze.jpg"
    };
    return x;
  }

}