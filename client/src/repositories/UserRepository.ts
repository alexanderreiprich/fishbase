import { SearchOptions } from "../interfaces/SearchOptions";
import { User } from "../interfaces/User";

interface ApiUser {
  id: number;
  picture: { type: "Buffer"; data: number[] } | string | null;
  username: string;
  aquarium: { type: "Buffer"; data: number[] } | string | null;
  favoritefish: number;
}

export class UserRepository {
  private static instance: UserRepository;
  private readonly baseUrl: string = "http://localhost:3002/api/users";

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
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

  public async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(
        `${this.baseUrl}/profile/${id}`,
        this.getFetchOptions()
      );
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Daten");
      }
      const data: ApiUser = await response.json();
      return this.transformToUser(data);
    } catch (error) {
      console.error("Fehler beim Abrufen der User:", error);
      throw error;
    }
  }

  public async getUsers(searchOptions: SearchOptions): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchOptions),
      });
      if (response.status === 404) {
        return [];
      } else if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Daten");
      }
      const data: ApiUser[] = await response.json();

      const transformedUsers = await Promise.all(
        data.map((apiData) => this.transformToUser(apiData))
      );
      return transformedUsers;
    } catch (error) {
      console.error("Fehler beim Abrufen der User:", error);
      throw error;
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/all`,
        this.getFetchOptions()
      );
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Daten");
      }
      const data: ApiUser[] = await response.json();
      const transformedUsers = await Promise.all(
        data.map((apiData) => this.transformToUser(apiData))
      );
      return transformedUsers;
    } catch (error) {
      console.error("Fehler beim Abrufen der User:", error);
      throw error;
    }
  }

  public async updateProfilePicture(picture: File): Promise<void> {
    try {
      // Bild zu Base64 konvertieren
      const base64 = await this.fileToBase64(picture);

      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/profile/picture`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ picture: base64 }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Profilbilds");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Profilbilds:", error);
      throw error;
    }
  }

  public async updateFavoriteFish(
    favoriteFishId: number | null
  ): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/profile/favoritefish`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favoritefish: favoriteFishId }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Lieblingsfisches");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Lieblingsfisches:", error);
      throw error;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Entferne den "data:image/...;base64," Prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  private async transformToUser(apiData: ApiUser): Promise<User> {
    const cleanedUser = {
      id: apiData.id,
      username: apiData.username,
      favoritefish: apiData.favoritefish,
      aquarium: apiData.aquarium ? this.toBlob(apiData.aquarium) : null,
      picture: apiData.picture ? this.toBlob(apiData.picture) : null,
      email: "",
      bio: "",
    };
    return cleanedUser;
  }

  private toBlob(data: { type: "Buffer"; data: number[] } | string): Blob {
    if (typeof data === "string") {
      // Base64-String zu Blob
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: "image/jpeg" });
    } else {
      // Buffer-Objekt zu Blob
      const byteArray = new Uint8Array(data.data);
      return new Blob([byteArray], { type: "image/jpeg" });
    }
  }
}
