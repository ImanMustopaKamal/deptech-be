import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, IsEnum } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+628123456789' })
  @IsNotEmpty()
  // @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'Jl. Contoh No. 123' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}