import { SuccessResponseDto } from 'common/dto/success-response.dto';
import { AdminResponseDto } from './response-admin.dto';

export type AdminSuccessResponse = SuccessResponseDto<AdminResponseDto | AdminResponseDto[]>;
