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
  async findByEmail(email: string): Promise<IUser | undefined> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      return user ? (user.toObject() as IUser) : undefined;
    } catch (error) {
      this.logger.error(
        `Error finding user by email: ${email}`,
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
  async create(dto: RegisterDTO): Promise<IUser> {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);
      const createdUser = new this.userModel({
        email: dto.email,
        password: hashed,
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
  async validateUser(email: string, password: string): Promise<IUser | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;
      const valid = await bcrypt.compare(password, user.password);
      return valid ? user : null;
    } catch (error) {
      this.logger.error(
        `Error validating user: ${email}`,
        error && (error as Error).stack,
      );
      return null;
    }
  }
}
