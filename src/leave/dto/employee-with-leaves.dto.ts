import { ApiProperty } from '@nestjs/swagger';
import { LeaveResponseDto } from './response-leave.dto';
import { Gender } from '../../employee/dto/create-employee.dto';

export class EmployeeWithLeavesDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ type: [LeaveResponseDto] })
  leaves: LeaveResponseDto[];

  @ApiProperty()
  totalLeaveDays: number;

  constructor(partial: Partial<EmployeeWithLeavesDto>) {
    Object.assign(this, partial);
  }
}