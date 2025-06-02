import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import { PermissionsGuard } from './permissions.guard';
import { RoutePermissionService } from './route-permission.service';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import {
  RoutePermission,
  RoutePermissionSchema,
} from './schemas/route-permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: RoutePermission.name, schema: RoutePermissionSchema },
    ]),
  ],
  providers: [PermissionService, PermissionsGuard, RoutePermissionService],
  exports: [PermissionService, PermissionsGuard, RoutePermissionService],
})
export class PermissionsModule {}
