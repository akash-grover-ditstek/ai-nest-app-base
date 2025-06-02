import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDTO } from './dto/auth-response.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { ChangePasswordResponse } from './interfaces/change-password-response.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthResponseDTO })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, type: AuthResponseDTO })
  async register(@Body() registerDto: RegisterDTO): Promise<AuthResponseDTO> {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 200, description: 'Password reset link sent' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDTO,
  ): Promise<{ message: string }> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: AuthResponseDTO })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDTO): AuthResponseDTO {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('change-password')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password for logged-in user' })
  @ApiOkResponse({
    description: 'Password changed successfully',
    schema: { example: { message: 'Password changed successfully' } },
  })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChangePasswordResponse> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
