import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({ example: 1, description: 'Admin ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'Admin first name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Admin last name' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Admin email address' })
  email: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z', description: 'Admin date of birth' })
  dateOfBirth: Date;

  @ApiProperty({ example: 'male', description: 'Admin gender' })
  gender: string;

  @ApiProperty({ example: '2023-05-15T10:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-05-15T10:30:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<AdminResponseDto>) {
    Object.assign(this, partial);
  }
}