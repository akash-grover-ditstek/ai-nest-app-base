import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'route_permissions', timestamps: true })
export class RoutePermission extends Document {
  @Prop({ required: true, index: true })
  route!: string; // e.g., '/users', '/users/:id'

  @Prop({ required: true, index: true })
  method!: string; // e.g., 'GET', 'POST', 'PUT', 'DELETE'

  @Prop({ type: [String], default: [], index: true })
  requiredRoles!: string[];

  @Prop({ type: [String], default: [], index: true })
  requiredPermissions!: string[];
}

export const RoutePermissionSchema =
  SchemaFactory.createForClass(RoutePermission);

RoutePermissionSchema.virtual('id').get(function (this: RoutePermission) {
  return this._id?.toString();
});

RoutePermissionSchema.set('toJSON', { virtuals: true, versionKey: false });
RoutePermissionSchema.set('toObject', { virtuals: true, versionKey: false });
