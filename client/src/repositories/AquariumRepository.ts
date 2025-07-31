import { Aquarium } from "../interfaces/Aquarium";
import { Inhabitant } from "../interfaces/Inhabitant";
import { InhabitantRepository } from "./InhabitantRepository";

interface ApiAquarium {
  id: number;
  userid: number;
  waterqualityid: number;
  name: string;
  capacity: number;
  inhabitants: string;
}

export class AquariumRepository {
  private static instance: AquariumRepository;
  private readonly baseUrl: string = "http://localhost:3002/api/aquariums";

  private constructor() {}

  public static getInstance(): AquariumRepository {
    if (!AquariumRepository.instance) {
      AquariumRepository.instance = new AquariumRepository();
    }
    return AquariumRepository.instance;
  }

  private getFetchOptions(): RequestInit {
    return {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    };
  }

  public async getAquariumsOfUser(id: number): Promise<Aquarium[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/user/${id}`,
        this.getFetchOptions()
      );
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error("Fehler beim Abrufen der Daten");
      }
      const data: ApiAquarium[] = await response.json();
      const transformedAquariums = await Promise.all(
        data.map((apiData) => this.transformToAquarium(apiData))
      );
      return transformedAquariums;
    } catch (error) {
      console.error("Fehler beim Abrufen der Aquarien:", error);
      throw error;
    }
  }

  public async createAquarium(
    userId: number,
    capacity: number,
    name: string
  ): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/user/create/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ capacity: capacity, name: name }),
      });
      if (!response.ok) {
        throw new Error("Fehler beim Erstelles des Aquariums");
      }
    } catch (error) {
      console.error("Fehler beim Erstelles des Aquariums:", error);
      throw error;
    }
  }

  public async updateAquarium(
    tank: Aquarium,
    inhabitants: Inhabitant[]
  ): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: tank.id,
          userId: tank.userId,
          waterQualityId: tank.waterQualityId,
          capacity: tank.capacity,
          name: tank.name,
          newInhabitants: inhabitants,
        }),
      });
      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Aquariums");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Aquariums");
      throw error;
    }
  }

  public async addInhabitantToAquarium(
    aquariumId: number,
    inhabitantId: number,
    amount: number
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getFetchOptions().headers,
        },
        body: JSON.stringify({ aquariumId, inhabitantId, amount }),
      });
      if (!response.ok) {
        throw new Error("Fehler beim Hinzufügen des Inhabitants");
      }
    } catch (error) {
      console.error(
        "Fehler beim Hinzufügen von Inhabitants in das Aquariums",
        error
      );
      throw error;
    }
  }

  private async transformToAquarium(apiData: ApiAquarium): Promise<Aquarium> {
    const cleanedAquarium = {
      id: apiData.id,
      userId: apiData.userid,
      waterQualityId: apiData.waterqualityid,
      capacity: apiData.capacity,
      name: apiData.name,
      inhabitants: await this.parseInhabitants(apiData.inhabitants),
    };
    return cleanedAquarium;
  }

  private async parseInhabitants(
    inhabitantString: string
  ): Promise<Inhabitant[]> {
    if (!inhabitantString || inhabitantString.trim() === "") {
      return [];
    }

    const inhabitantIds = inhabitantString
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");

    const inhabitantRepo = InhabitantRepository.getInstance();

    const inhabitantPromises = inhabitantIds.map(async (id) => {
      try {
        const inhabitant = await inhabitantRepo.getInhabitantById(Number(id));
        return inhabitant as Inhabitant;
      } catch (error) {
        console.error(
          `Fehler beim Abrufen des Inhabitants mit ID ${id}:`,
          error
        );
        return null;
      }
    });

    const results = await Promise.all(inhabitantPromises);
    return results.filter(
      (inhabitant): inhabitant is Inhabitant => inhabitant !== null
    );
  }
}
