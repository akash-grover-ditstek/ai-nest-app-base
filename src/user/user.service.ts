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
}
