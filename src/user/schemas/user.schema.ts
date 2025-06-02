import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * User MongoDB schema optimized for query performance and maintainability.
 * - Indexes: email (unique, indexed)
 * - Timestamps: createdAt, updatedAt
 * - Virtual id: maps _id to id
 * - Ready for projections, pagination, and future extensibility
 */
@Schema({
  collection: 'users',
  timestamps: true, // Adds createdAt and updatedAt fields
})
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, index: true })
  firstName!: string;

  @Prop({ required: true, index: true })
  lastName!: string;

  @Prop({ required: true })
  dob!: string;

  // For future extensibility: e.g., soft delete
  // @Prop({ default: false, index: true })
  // isDeleted?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual id property to treat _id and id as the same
UserSchema.virtual('id').get(function (this: { _id: Types.ObjectId | string }) {
  if (this._id instanceof Types.ObjectId) {
    return this._id.toHexString();
  }
  return typeof this._id === 'string' ? this._id : undefined;
});

UserSchema.set('toJSON', { virtuals: true, versionKey: false });
UserSchema.set('toObject', { virtuals: true, versionKey: false });

// Compound index example for future query optimization
// UserSchema.index({ email: 1, lastName: 1 });
