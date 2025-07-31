export interface User {
  id: number;
  username: string;
  email: string;
  picture: Blob | null;
  favoritefish: number | null;
  tank: Blob | null;
}