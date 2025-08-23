import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDataDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  // @ApiProperty({
  //   description: 'HTTP status code',
  //   example: 400,
  // })
  // statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2023-05-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path where error occurred',
    example: '/auth/login',
  })
  path: string;

  constructor(partial: Partial<MetaDataDto>) {
    Object.assign(this, partial);
  }
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error details',
    oneOf: [
      { type: 'object', description: 'Error object' },
      { type: 'array', description: 'Array of errors' },
      { type: 'string', description: 'Error message' },
    ],
    example: { field: 'email', message: 'Invalid email format' },
  })
  errors: any;

  @ApiProperty({ type: MetaDataDto })
  metaData: MetaDataDto;

  constructor(
    errors: any,
    metaData: Partial<MetaDataDto>
  ) {
    this.errors = errors;
    this.metaData = new MetaDataDto(metaData);
  }
}