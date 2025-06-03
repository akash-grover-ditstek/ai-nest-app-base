export interface IRoutePermission {
  id: string;
  route: string;
  method: string;
  requiredRoles: string[];
  requiredPermissions: string[];
}
