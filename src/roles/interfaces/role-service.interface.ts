import { IRole } from './role.interface';

export interface IRoleService {
  createRole(name: string, permissions: string[]): Promise<IRole>;
  updateRole(
    roleId: string,
    name: string,
    permissions: string[],
  ): Promise<IRole>;
  deleteRole(roleId: string): Promise<void>;
  getRoleById(roleId: string): Promise<IRole | undefined>;
  getAllRoles(): Promise<IRole[]>;
}
