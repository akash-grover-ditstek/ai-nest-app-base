import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUserPermissions } from './interfaces/request-with-user-permissions.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserPermissions>();
    const { user } = request;
    if (!user || !user.permissions) return false;
    const hasPermission = user.permissions.some((perm: string) =>
      requiredPermissions.includes(perm),
    );
    if (!hasPermission) throw new ForbiddenException('Insufficient permission');
    return true;
  }
}
