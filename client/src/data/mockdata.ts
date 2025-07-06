import { Animal } from "../interfaces/Animal";
import { InhabitantType } from "../interfaces/InhabitantType";
import { Plant } from "../interfaces/Plant";

export class MockData {

  private async fetchImages(): Promise<Blob[]> {
    // Lokale Bilder aus dem public-Ordner verwenden
    let animalImage = "/images/mock-fish.jpg";
    let plantImage = "/images/mock-plant.jpg";
    
    try {
      const [animalResponse, plantResponse] = await Promise.all([
        fetch(animalImage),
        fetch(plantImage)
      ]);

      if (!animalResponse.ok || !plantResponse.ok) {
        throw new Error('Fehler beim Herunterladen der Bilder');
      }

      const [animalBlob, plantBlob] = await Promise.all([
        animalResponse.blob(),
        plantResponse.blob()
      ]);

      return [animalBlob, plantBlob];
    } catch (error) {
      console.error('Fehler beim Laden der Bilder:', error);
      // Fallback: Leere Blobs zurückgeben
      return [
        new Blob([], { type: 'image/jpeg' }),
        new Blob([], { type: 'image/jpeg' })
      ];
    }
  }

  public async getMockAnimal(): Promise<Animal> {
    const [animalBlob] = await this.fetchImages();
    const x: Animal = {
      id: 0,
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
      image: animalBlob
    };
    return x;
  }

  public async getMockPlant(): Promise<Plant> {
    const [, plantBlob] = await this.fetchImages();
    const x: Plant = {
      id: 1,
      type: InhabitantType.PLANT,
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
      image: plantBlob
    };
    return x;
  }

}