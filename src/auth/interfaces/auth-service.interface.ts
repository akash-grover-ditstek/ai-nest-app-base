import { AuthResponseDTO } from '../dto/auth-response.dto';
import { ForgotPasswordDTO } from '../dto/forgot-password.dto';
import { LoginDTO } from '../dto/login.dto';
import { RefreshTokenDTO } from '../dto/refresh-token.dto';
import { RegisterDTO } from '../dto/register.dto';

export interface IAuthService {
  login(loginDto: LoginDTO): Promise<AuthResponseDTO>;
  register(registerDto: RegisterDTO): Promise<AuthResponseDTO>;
  forgotPassword(dto: ForgotPasswordDTO): Promise<{ message: string }>;
  refreshToken(dto: RefreshTokenDTO): AuthResponseDTO;
}
