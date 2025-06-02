import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPermission } from './interfaces/permission.interface';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async createPermission(
    name: string,
    description?: string,
  ): Promise<IPermission> {
    const created = new this.permissionModel({ name, description });
    const permission = await created.save();
    return permission.toObject() as IPermission;
  }

  async updatePermission(
    permissionId: string,
    name: string,
    description?: string,
  ): Promise<IPermission> {
    const updated = await this.permissionModel.findByIdAndUpdate(
      permissionId,
      { name, description },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Permission not found');
    return updated.toObject() as IPermission;
  }

  async deletePermission(permissionId: string): Promise<void> {
    await this.permissionModel.findByIdAndDelete(permissionId);
  }

  async getPermissionById(
    permissionId: string,
  ): Promise<IPermission | undefined> {
    const permission = await this.permissionModel.findById(permissionId).lean();
    return permission as IPermission | undefined;
  }

  async getAllPermissions(): Promise<IPermission[]> {
    return (await this.permissionModel.find().lean()) as IPermission[];
  }
}
