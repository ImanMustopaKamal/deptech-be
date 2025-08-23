import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@mail.com', description: 'Admin email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Admin password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}