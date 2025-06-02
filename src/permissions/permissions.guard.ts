import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.permissions) return false;
    const hasPermission = user.permissions.some((perm: string) =>
      requiredPermissions.includes(perm),
    );
    if (!hasPermission) throw new ForbiddenException('Insufficient permission');
    return true;
  }
}
