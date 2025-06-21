import { Animal } from "../interfaces/Animal";
import { Plant } from "../interfaces/Plant";
import { InhabitantType } from "../interfaces/InhabitantType";
import { Habitat } from "../interfaces/Habitat";
import { SearchOptions } from "../interfaces/SearchOptions";

interface ApiInhabitant {
  id: number;
  name: string;
  latinname: string;
  habitat: string;
  color: string;
  predators: string;
  image: string | { type: string; data: number[] };
  type: string;
  length?: number;
  food?: string;
  minheight?: number;
  maxheight?: number;
}

export class InhabitantRepository {
  private static instance: InhabitantRepository;
  private readonly baseUrl: string = 'http://localhost:5000/api/inhabitants';

  private constructor() {}

  public static getInstance(): InhabitantRepository {
    if (!InhabitantRepository.instance) {
      InhabitantRepository.instance = new InhabitantRepository();
    }
    return InhabitantRepository.instance;
  }

  private getFetchOptions(): RequestInit {
    return {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    };
  }

  public async getInhabitants(searchOptions: SearchOptions): Promise<(Animal | Plant)[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchOptions)
      });
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten');
      }
      const data: ApiInhabitant[] = await response.json();

      const transformedInhabitants = await Promise.all(
        data.map(apiData => this.transformToInhabitant(apiData))
      );
      return transformedInhabitants;
    } catch (error) {
      console.error('Fehler beim Abrufen der Inhabitants:', error);
      throw error;
    }
  }

  public async getAllInhabitants(): Promise<(Animal | Plant)[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all`, this.getFetchOptions());
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten');
      }
      const data: ApiInhabitant[] = await response.json();

      const transformedInhabitants = await Promise.all(
        data.map(apiData => this.transformToInhabitant(apiData))
      );
      
      return transformedInhabitants;
    } catch (error) {
      console.error('Fehler beim Abrufen der Inhabitants:', error);
      throw error;
    }
  }

  private async transformToInhabitant(apiData: ApiInhabitant): Promise<Animal | Plant> {
    const baseInhabitant = {
      name: apiData.name,
      latinName: apiData.latinname,
      habitat: this.createHabitat(apiData.habitat),
      color: apiData.color,
      // predators: await this.parsePredators(apiData.predators), // TODO: Fix Loop
			predators: [],
      image:
        apiData.image && typeof apiData.image === "object" && "data" in apiData.image // Checks if this is a Buffer object that contains the image
          ? new Blob([new Uint8Array((apiData.image as any).data)], { type: 'image/jpeg' }) // Creates a blob from the buffer object
          : null
    };
    if (apiData.type === 'fish' || apiData.type === 'invertebrate') {
      return {
        ...baseInhabitant,
        type: apiData.type === 'fish' ? InhabitantType.FISH : InhabitantType.INVERTEBRATE,
        length: apiData.length || 0,
        food: apiData.food || ''
      } as Animal;
    } else {
      return {
        ...baseInhabitant,
        type: InhabitantType.PLANT,
        minHeight: apiData.minheight || 0,
        maxHeight: apiData.maxheight || 0
      } as Plant;
    }
  }

	// TODO: Richtige Daten verwenden
  private createHabitat(region: string): Habitat {
    return {
      region: region,
      waterQuality: {
        salinity: 1.0,
        temperature: 25,
        ph: 7.0
      }
    };
  }

  private async parsePredators(predatorsString: string): Promise<Animal[]> {
    if (!predatorsString) return [];
    
    let stringArray = predatorsString.split(',');
    
    const predatorPromises = stringArray.map(async (id) => {
      try {
        return await this.getInhabitantById(Number(id));
      } catch (error) {
        console.error(`Fehler beim Abrufen des Predators mit ID ${id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(predatorPromises);
    return results.filter((predator): predator is Animal => 
      predator !== null && 
      (predator.type === InhabitantType.FISH || predator.type === InhabitantType.INVERTEBRATE)
    );
  }

  private async getInhabitantById(id: number): Promise<Animal | Plant> {
    const response = await fetch(`${this.baseUrl}/${id}`, this.getFetchOptions());
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }
    const data: ApiInhabitant = await response.json();
    return this.transformToInhabitant(data);
  }
} 