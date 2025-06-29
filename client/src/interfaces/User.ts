export interface User {
  id: number;
  username: string;
  email: string;
  profile_image: Blob | null;
  bio: string;
}