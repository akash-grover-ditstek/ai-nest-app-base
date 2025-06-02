export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  roles: string[]; // Use string literal union if roles are fixed
  permissions: string[];
}
