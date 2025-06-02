import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRole } from './interfaces/role.interface';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async createRole(name: string, permissions: string[]): Promise<IRole> {
    const created = new this.roleModel({ name, permissions });
    const role = await created.save();
    return role.toObject() as IRole;
  }

  async updateRole(
    roleId: string,
    name: string,
    permissions: string[],
  ): Promise<IRole> {
    const updated = await this.roleModel.findByIdAndUpdate(
      roleId,
      { name, permissions },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Role not found');
    return updated.toObject() as IRole;
  }

  async deleteRole(roleId: string): Promise<void> {
    await this.roleModel.findByIdAndDelete(roleId);
  }

  async getRoleById(roleId: string): Promise<IRole | undefined> {
    const role = await this.roleModel.findById(roleId).lean();
    return role as IRole | undefined;
  }

  async getAllRoles(): Promise<IRole[]> {
    return (await this.roleModel.find().lean()) as IRole[];
  }
}
