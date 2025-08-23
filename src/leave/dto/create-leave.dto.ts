import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateLeaveDto {
  @ApiProperty({ example: 'Liburan keluarga' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-01-20' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  employeeId: number;
}