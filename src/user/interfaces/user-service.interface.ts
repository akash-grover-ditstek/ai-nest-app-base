import { RegisterDTO } from '../../auth/dto/register.dto';
import { IUser } from './user.interface';

export interface IUserService {
  findByEmail(email: string): Promise<IUser | undefined>;
  create(dto: RegisterDTO): Promise<IUser>;
  validateUser(email: string, password: string): Promise<IUser | null>;
  findById(userId: string): Promise<IUser | undefined>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  assignRole(userId: string, roleName: string): Promise<IUser>;
  removeRole(userId: string, roleName: string): Promise<IUser>;
  assignPermission(userId: string, permission: string): Promise<IUser>;
  removePermission(userId: string, permission: string): Promise<IUser>;
}
