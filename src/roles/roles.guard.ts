import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { IRoutePermissionService } from '../permissions/interfaces/route-permission-service.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly routePermissionService: IRoutePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { roles?: string[] } }>();
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
      !routePermission.requiredRoles ||
      routePermission.requiredRoles.length === 0
    ) {
      return true;
    }
    if (!user || !user.roles) {
      return false;
    }
    for (let i = 0, len = routePermission.requiredRoles.length; i < len; ++i) {
      if (user.roles.includes(routePermission.requiredRoles[i])) {
        return true;
      }
    }
    throw new ForbiddenException('Insufficient role');
  }
}
