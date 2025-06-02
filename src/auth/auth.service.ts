import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { AuthResponseDTO } from './dto/auth-response.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { RegisterDTO } from './dto/register.dto';
import { IAuthService } from './interfaces/auth-service.interface';
import { ChangePasswordResponse } from './interfaces/change-password-response.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

/**
 * AuthService handles authentication and user registration logic.
 *
 * - Uses dependency injection for all services.
 * - All methods use DTOs for input/output.
 * - All errors are handled with NestJS exceptions.
 * - No sensitive data is logged or exposed.
 * - All tokens are generated using environment variables for secrets.
 * - All business logic is in the service, not the controller.
 * - JSDoc comments provided for public methods.
 */
@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Authenticates a user and returns access/refresh tokens.
   * @param loginDto Login credentials
   * @returns AuthResponseDTO
   */
  async login(loginDto: LoginDTO): Promise<AuthResponseDTO> {
    const authenticatedUser = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!authenticatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(
      authenticatedUser.id,
      authenticatedUser.email,
      authenticatedUser.roles,
      authenticatedUser.permissions,
    );
  }

  /**
   * Registers a new user and returns access/refresh tokens.
   * @param registerDto Registration data
   * @returns AuthResponseDTO
   */
  async register(registerDto: RegisterDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const createdUser = await this.userService.create(registerDto);
    return this.generateTokens(
      createdUser.id,
      createdUser.email,
      createdUser.roles,
      createdUser.permissions,
    );
  }

  /**
   * Sends a password reset email if the user exists.
   * Does not reveal user existence for security.
   * @param forgotPasswordDto ForgotPasswordDTO
   * @returns message
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDTO,
  ): Promise<{ message: string }> {
    const userToReset = await this.userService.findByEmail(
      forgotPasswordDto.email,
    );
    if (userToReset) {
      const resetToken = this.jwtService.sign(
        { sub: userToReset.id, email: userToReset.email },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      );
      const resetLink = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      await this.emailService.sendMail(
        userToReset.email,
        'Reset your password',
        `Click the link to reset your password: ${resetLink}`,
      );
      this.logger.log(`Password reset email sent to ${userToReset.email}`);
    }
    return { message: 'If your email exists, a reset link has been sent.' };
  }

  /**
   * Refreshes the access token using a valid refresh token.
   * @param refreshTokenDto RefreshTokenDTO
   * @returns AuthResponseDTO
   */
  refreshToken(refreshTokenDto: RefreshTokenDTO): AuthResponseDTO {
    try {
      const jwtPayload = this.jwtService.verify<IJwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      return this.generateTokens(
        jwtPayload.sub,
        jwtPayload.email,
        jwtPayload.roles,
        jwtPayload.permissions,
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Changes the password for a logged-in user.
   * @param userId User ID
   * @param dto ChangePasswordDTO
   * @returns ChangePasswordResponse
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDTO,
  ): Promise<ChangePasswordResponse> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isCurrentPasswordValid = await this.userService.validateUser(
      user.email,
      dto.currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different');
    }
    await this.userService.updatePassword(user.id, dto.newPassword);
    this.logger.log(`Password changed for user: ${user.email}`);
    return { message: 'Password changed successfully' };
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param userId User ID
   * @param userEmail User email
   * @param roles User roles
   * @param permissions User permissions
   * @returns AuthResponseDTO
   */
  private generateTokens(
    userId: string,
    userEmail: string,
    roles: string[],
    permissions: string[],
  ): AuthResponseDTO {
    const accessToken = this.jwtService.sign(
      { sub: userId, email: userEmail, roles, permissions },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId, email: userEmail, roles, permissions },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }
}
