import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'roles', timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true, index: true })
  name!: string;

  @Prop({ type: [String], default: [], index: true })
  permissions!: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual('id').get(function (this: Role) {
  return this._id?.toString();
});

RoleSchema.set('toJSON', { virtuals: true, versionKey: false });
RoleSchema.set('toObject', { virtuals: true, versionKey: false });
