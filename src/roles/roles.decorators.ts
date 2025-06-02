import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator for RBAC. Usage: @Roles('admin', 'user')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
