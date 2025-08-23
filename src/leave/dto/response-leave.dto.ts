import { ApiProperty } from '@nestjs/swagger';
import { ResponseEmployeeDto } from '../../employee/dto/response-employee.dto';

export class LeaveResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  employeeId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: ResponseEmployeeDto })
  employee: ResponseEmployeeDto;

  constructor(partial: Partial<LeaveResponseDto>) {
    Object.assign(this, partial);
  }
}