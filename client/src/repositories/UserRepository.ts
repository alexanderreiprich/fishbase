import { SearchOptions } from "../interfaces/SearchOptions";
import { User } from "../interfaces/User";

interface ApiUser {
	id: number;
	picture: Blob;
	username: string;
}

export class UserRepository {
	private static instance: UserRepository;
	private readonly baseUrl: string = 'http://localhost:3002/api/users';

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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    };
	}

	public async getUsers(searchOptions: SearchOptions): Promise<User[]> {
		try {
			const response = await fetch(`${this.baseUrl}/search`, {
				method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchOptions)
			});
			if (response.status == 404) {
        return [];
      }
			else if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten');
      }
			const data: ApiUser[] = await response.json();

			const transformedUsers = await Promise.all(
				data.map(apiData => this.transformToUser(apiData))
			);
			return transformedUsers;
		} catch (error) {
			console.error('Fehler beim Abrufen der User:', error);
      throw error;
		}
	}

	public async getAllUsers(): Promise<User[]> {
		try {
			const response = await fetch(`${this.baseUrl}/all`, this.getFetchOptions());
			if (!response.ok) {
				throw new Error('Fehler beim Abrufen der Daten');
			}
			const data: ApiUser[] = await response.json();
			const transformedUsers = await Promise.all(
				data.map(apiData => this.transformToUser(apiData))
			);
			return transformedUsers;
		} catch (error) {
			console.error('Fehler beim Abrufen der User:', error);
      throw error;
		}
	}

	private async transformToUser(apiData: ApiUser): Promise<User> {
		const cleanedUser = {
			id: apiData.id,
			username: apiData.username,
			profile_image: apiData.picture && typeof apiData.picture === "object" && "data" in apiData.picture // Checks if this is a Buffer object that contains the image
			? new Blob([new Uint8Array((apiData.picture as any).data)], { type: 'image/jpeg' }) // Creates a blob from the buffer object
			: null,
			email: "",
			bio: ""
		};
		return cleanedUser;
	}

}