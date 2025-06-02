import { SetMetadata } from '@nestjs/common';

/**
 * Permissions decorator for RBAC. Usage: @Permissions('read', 'write')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
