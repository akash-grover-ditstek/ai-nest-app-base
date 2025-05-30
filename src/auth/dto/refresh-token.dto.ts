import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}
