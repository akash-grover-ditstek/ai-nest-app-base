export interface IRole {
  id: string;
  name: string;
  permissions: string[]; // Permission names (string) for flexibility
}
