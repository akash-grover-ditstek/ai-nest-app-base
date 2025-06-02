import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutePermissionService } from '../permissions/route-permission.service';
import {
  RoutePermission,
  RoutePermissionSchema,
} from '../permissions/schemas/route-permission.schema';
import { RoleService } from './role.service';
import { RolesGuard } from './roles.guard';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: RoutePermission.name, schema: RoutePermissionSchema },
    ]),
  ],
  providers: [RoleService, RolesGuard, RoutePermissionService],
  exports: [RoleService, RolesGuard, RoutePermissionService],
})
export class RolesModule {}
