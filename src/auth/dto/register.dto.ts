import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsDateString()
  dob!: string;
}
