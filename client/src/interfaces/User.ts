export interface User {
  id: number;
  username: string;
  email: string;
  profile_image: Blob | null;
  favorite_fish: number | null;
  aquarium_image: Blob | null;
}