export interface User {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  roles: string[];
  joinDate?: string | null;
}