export interface User {
  id: number;
  username: string;
  email: string;
  picture: Blob | null;
  favoritefish: number | null;
  aquarium: Blob | null;
}