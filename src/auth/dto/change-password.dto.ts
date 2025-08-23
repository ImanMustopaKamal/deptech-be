import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password (min 6 characters)', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}