import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  IsDateString, 
  IsEnum,
  ValidateIf 
} from 'class-validator';
import { Gender } from 'src/employee/dto/create-employee.dto';

export class UpdateAdminDto {
  @ApiPropertyOptional({ description: 'Admin first name' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'First name must be at least 1 character' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Admin last name' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Last name must be at least 1 character' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'Admin email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Admin password (min 6 characters, optional for update)', 
    minLength: 6 
  })
  @IsOptional()
  @ValidateIf(o => o.password !== undefined && o.password !== '') // Hanya validasi jika password diisi
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @ApiPropertyOptional({ description: 'Admin date of birth (ISO format)' })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ 
    enum: Gender, 
    description: 'Admin gender' 
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Invalid gender value' })
  gender?: Gender;
}