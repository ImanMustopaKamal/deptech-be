import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './create-employee.dto';

export class ResponseEmployeeDto {
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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<ResponseEmployeeDto>) {
    Object.assign(this, partial);
  }
}