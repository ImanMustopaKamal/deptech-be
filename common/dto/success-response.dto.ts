import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDataDto {
  @ApiPropertyOptional({ example: 42, description: 'Total number of items' })
  total?: number;

  @ApiPropertyOptional({ example: 1, description: 'Current page' })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  limit?: number;

  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully',
  })
  message: string;

  // @ApiProperty({
  //   description: 'HTTP status code',
  //   example: 200,
  // })
  // statusCode: number;

  constructor(partial?: Partial<MetaDataDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

export class SuccessResponseDto<T> {
  @ApiProperty({
    description: 'Response data',
    oneOf: [
      { type: 'object', description: 'Single object response' },
      { type: 'array', description: 'Array of objects response' },
    ],
  })
  data: T | T[];

  @ApiPropertyOptional({ type: MetaDataDto })
  metaData?: MetaDataDto;

  constructor(data: T | T[], metaData?: Partial<MetaDataDto>) {
    this.data = data;
    // if (metaData) {
    //   this.metaData = new MetaDataDto(metaData);
    // }
    this.metaData = metaData ? new MetaDataDto(metaData) : undefined;
  }
}
