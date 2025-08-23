import { IsEmail, IsNotEmpty, IsString, IsDateString, IsIn, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'John', description: 'Admin first name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Admin last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Admin email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1990-01-01', description: 'Admin date of birth' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty({ example: 'male', description: 'Admin gender', enum: ['male', 'female', 'other'] })
  @IsNotEmpty()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({ example: 'password123', description: 'Admin password (min 6 characters)', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}