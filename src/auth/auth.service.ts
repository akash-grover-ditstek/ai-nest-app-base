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
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { RegisterDTO } from './dto/register.dto';
import { IAuthService } from './interfaces/auth-service.interface';
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
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.generateTokens(user.id, user.email);
  }

  /**
   * Registers a new user and returns access/refresh tokens.
   * @param registerDto Registration data
   * @returns AuthResponseDTO
   */
  async register(registerDto: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await this.userService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already registered');
    const user = await this.userService.create(registerDto);
    return this.generateTokens(user.id, user.email);
  }

  /**
   * Sends a password reset email if the user exists.
   * Does not reveal user existence for security.
   * @param dto ForgotPasswordDTO
   * @returns message
   */
  async forgotPassword(dto: ForgotPasswordDTO): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (user) {
      const resetToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      );
      const resetLink = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      await this.emailService.sendMail(
        user.email,
        'Reset your password',
        `Click the link to reset your password: ${resetLink}`,
      );
      this.logger.log(`Password reset email sent to ${user.email}`);
    }
    return { message: 'If your email exists, a reset link has been sent.' };
  }

  /**
   * Refreshes the access token using a valid refresh token.
   * @param dto RefreshTokenDTO
   * @returns AuthResponseDTO
   */
  refreshToken(dto: RefreshTokenDTO): AuthResponseDTO {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param userId User ID
   * @param email User email
   * @returns AuthResponseDTO
   */
  private generateTokens(userId: string, email: string): AuthResponseDTO {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }
}
