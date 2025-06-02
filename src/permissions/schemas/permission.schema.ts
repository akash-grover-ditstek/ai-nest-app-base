import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'permissions', timestamps: true })
export class Permission extends Document {
  @Prop({ required: true, unique: true, index: true })
  name!: string;

  @Prop({ required: false })
  description?: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.virtual('id').get(function (this: Permission) {
  return this._id?.toString();
});

PermissionSchema.set('toJSON', { virtuals: true, versionKey: false });
PermissionSchema.set('toObject', { virtuals: true, versionKey: false });
