import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IPermission } from '../permissions/interfaces/permission.interface';
import { PermissionService } from '../permissions/permission.service';
import { IRole } from '../roles/interfaces/role.interface';
import { RoleService } from '../roles/role.service';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  // --- Role CRUD ---
  @Post('roles')
  async createRole(
    @Body() body: { name: string; permissions: string[] },
  ): Promise<IRole> {
    return await this.roleService.createRole(body.name, body.permissions);
  }

  @Put('roles/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: { name: string; permissions: string[] },
  ): Promise<IRole> {
    return await this.roleService.updateRole(id, body.name, body.permissions);
  }

  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('id') id: string): Promise<void> {
    return await this.roleService.deleteRole(id);
  }

  @Get('roles')
  async getAllRoles(): Promise<IRole[]> {
    return await this.roleService.getAllRoles();
  }

  @Get('roles/:id')
  async getRoleById(@Param('id') id: string): Promise<IRole | undefined> {
    return await this.roleService.getRoleById(id);
  }

  // --- Permission CRUD ---
  @Post('permissions')
  async createPermission(
    @Body() body: { name: string; description?: string },
  ): Promise<IPermission> {
    return await this.permissionService.createPermission(
      body.name,
      body.description,
    );
  }

  @Put('permissions/:id')
  async updatePermission(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string },
  ): Promise<IPermission> {
    return await this.permissionService.updatePermission(
      id,
      body.name,
      body.description,
    );
  }

  @Delete('permissions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermission(@Param('id') id: string): Promise<void> {
    return await this.permissionService.deletePermission(id);
  }

  @Get('permissions')
  async getAllPermissions(): Promise<IPermission[]> {
    return await this.permissionService.getAllPermissions();
  }

  @Get('permissions/:id')
  async getPermissionById(
    @Param('id') id: string,
  ): Promise<IPermission | undefined> {
    return await this.permissionService.getPermissionById(id);
  }
}
