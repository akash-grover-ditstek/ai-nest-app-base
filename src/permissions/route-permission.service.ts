import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRoutePermissionService } from './interfaces/route-permission-service.interface';
import { IRoutePermission } from './interfaces/route-permission.interface';
import { RoutePermission } from './schemas/route-permission.schema';

@Injectable()
export class RoutePermissionService implements IRoutePermissionService {
  constructor(
    @InjectModel(RoutePermission.name)
    private readonly routePermissionModel: Model<RoutePermission>,
  ) {}

  async getRoutePermission(
    route: string,
    method: string,
  ): Promise<IRoutePermission | undefined> {
    const found = await this.routePermissionModel
      .findOne({ route, method })
      .lean();
    return found as IRoutePermission | undefined;
  }

  async setRoutePermission(
    route: string,
    method: string,
    requiredRoles: string[],
    requiredPermissions: string[],
  ): Promise<IRoutePermission> {
    const updated = await this.routePermissionModel.findOneAndUpdate(
      { route, method },
      { requiredRoles, requiredPermissions },
      { upsert: true, new: true },
    );
    return updated.toObject() as IRoutePermission;
  }

  async deleteRoutePermission(route: string, method: string): Promise<void> {
    await this.routePermissionModel.findOneAndDelete({ route, method });
  }

  async getAllRoutePermissions(): Promise<IRoutePermission[]> {
    return (await this.routePermissionModel
      .find()
      .lean()) as IRoutePermission[];
  }
}
