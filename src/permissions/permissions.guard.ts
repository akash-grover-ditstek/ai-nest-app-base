import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestWithUserPermissions } from './interfaces/request-with-user-permissions.interface';
import { IRoutePermissionService } from './interfaces/route-permission-service.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly routePermissionService: IRoutePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & RequestWithUserPermissions>();
    const user = request.user;
    const routePath = request.path;
    const httpMethod = request.method;
    const routePermission =
      await this.routePermissionService.getRoutePermission(
        routePath,
        httpMethod,
      );
    if (
      !routePermission ||
      !routePermission.requiredPermissions ||
      routePermission.requiredPermissions.length === 0
    ) {
      return true;
    }
    if (!user || !user.permissions) {
      return false;
    }
    for (
      let i = 0, len = routePermission.requiredPermissions.length;
      i < len;
      ++i
    ) {
      if (user.permissions.includes(routePermission.requiredPermissions[i])) {
        return true;
      }
    }
    throw new ForbiddenException('Insufficient permission');
  }
}
