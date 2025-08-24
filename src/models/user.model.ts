export interface User {
  id: string;
  username: string;
  password: string; // Hashed
  role: 'user' | 'admin';
}