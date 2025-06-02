import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RegisterDTO } from '../auth/dto/register.dto';
import { IUserService } from './interfaces/user-service.interface';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.schema';

/**
 * UserService provides user management and authentication logic.
 *
 * - Implements interface-based abstraction for testability and flexibility.
 * - Uses dependency injection.
 * - All business logic is in the service, not the controller.
 * - No sensitive data is logged or exposed.
 * - JSDoc comments provided for public methods.
 */
@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Finds a user by email address.
   * @param email User email
   * @returns IUser or undefined
   */
  async findByEmail(userEmail: string): Promise<IUser | undefined> {
    try {
      const user = await this.userModel.findOne({ email: userEmail }).exec();
      return user ? (user.toObject() as IUser) : undefined;
    } catch (error) {
      this.logger.error(
        `Error finding user by email: ${userEmail}`,
        error && (error as Error).stack,
      );
      return undefined;
    }
  }

  /**
   * Creates a new user with hashed password.
   * @param dto RegisterDTO
   * @returns IUser
   */
  async create(registerDto: RegisterDTO): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      // Check if user is at least 18 years old
      const dobDate = new Date(registerDto.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      const isBirthdayPassed =
        monthDiff > 0 ||
        (monthDiff === 0 && today.getDate() >= dobDate.getDate());

      const actualAge = isBirthdayPassed ? age : age - 1;
      if (actualAge < 18) {
        throw new Error('User must be at least 18 years old.');
      }

      const createdUser = new this.userModel({
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        dob: registerDto.dob,
        roles: ['user'], // Default role
        permissions: [], // Default permissions
      });
      const user = await createdUser.save();
      this.logger.log(`User created: ${user.email}`);
      return user.toObject() as IUser;
    } catch (error) {
      this.logger.error('Error creating user', error && (error as Error).stack);
      throw error;
    }
  }

  /**
   * Validates a user's credentials.
   * @param email User email
   * @param password Plain password
   * @returns IUser or null
   */
  async validateUser(
    userEmail: string,
    plainPassword: string,
  ): Promise<IUser | null> {
    try {
      const user = await this.findByEmail(userEmail);
      if (!user) return null;
      const isPasswordValid = await bcrypt.compare(
        plainPassword,
        user.password,
      );
      return isPasswordValid ? user : null;
    } catch (error) {
      this.logger.error(
        `Error validating user: ${userEmail}`,
        error && (error as Error).stack,
      );
      return null;
    }
  }

  /**
   * Finds a user by ID.
   * @param userId User ID
   * @returns IUser or undefined
   */
  async findById(userId: string): Promise<IUser | undefined> {
    try {
      const user = await this.userModel.findById(userId).exec();
      return user ? (user.toObject() as IUser) : undefined;
    } catch (error) {
      this.logger.error(
        `Error finding user by ID: ${userId}`,
        error && (error as Error).stack,
      );
      return undefined;
    }
  }

  /**
   * Updates a user's password (hashed).
   * @param userId User ID
   * @param newPassword New plain password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModel.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
      this.logger.log(`Password updated for user ID: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error updating password for user ID: ${userId}`,
        error && (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Assigns a role to a user.
   * @param userId User ID
   * @param roleName Role name
   * @returns Updated IUser
   */
  async assignRole(userId: string, roleName: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.roles.includes(roleName)) {
      user.roles.push(roleName);
      await user.save();
    }
    return user.toObject() as IUser;
  }

  /**
   * Removes a role from a user.
   * @param userId User ID
   * @param roleName Role name
   * @returns Updated IUser
   */
  async removeRole(userId: string, roleName: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    user.roles = user.roles.filter((role: string) => role !== roleName);
    await user.save();
    return user.toObject() as IUser;
  }

  /**
   * Assigns a permission to a user.
   * @param userId User ID
   * @param permission Permission name
   * @returns Updated IUser
   */
  async assignPermission(userId: string, permission: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.permissions.includes(permission)) {
      user.permissions.push(permission);
      await user.save();
    }
    return user.toObject() as IUser;
  }

  /**
   * Removes a permission from a user.
   * @param userId User ID
   * @param permission Permission name
   * @returns Updated IUser
   */
  async removePermission(userId: string, permission: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    user.permissions = user.permissions.filter(
      (perm: string) => perm !== permission,
    );
    await user.save();
    return user.toObject() as IUser;
  }
}
