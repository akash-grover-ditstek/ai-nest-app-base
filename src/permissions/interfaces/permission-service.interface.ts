import { IPermission } from './permission.interface';

export interface IPermissionService {
  createPermission(name: string, description?: string): Promise<IPermission>;
  updatePermission(
    permissionId: string,
    name: string,
    description?: string,
  ): Promise<IPermission>;
  deletePermission(permissionId: string): Promise<void>;
  getPermissionById(permissionId: string): Promise<IPermission | undefined>;
  getAllPermissions(): Promise<IPermission[]>;
}
