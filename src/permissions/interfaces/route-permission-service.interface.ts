import { IRoutePermission } from './route-permission.interface';

export interface IRoutePermissionService {
  getRoutePermission(
    route: string,
    method: string,
  ): Promise<IRoutePermission | undefined>;
  setRoutePermission(
    route: string,
    method: string,
    requiredRoles: string[],
    requiredPermissions: string[],
  ): Promise<IRoutePermission>;
  deleteRoutePermission(route: string, method: string): Promise<void>;
  getAllRoutePermissions(): Promise<IRoutePermission[]>;
}
