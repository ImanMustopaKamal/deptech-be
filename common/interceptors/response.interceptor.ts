import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SuccessResponseDto } from '../dto/success-response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        if (data instanceof SuccessResponseDto) {
          return data;
        }

        if (data && data.data !== undefined && data.metaData !== undefined) {
          return data;
        }

        if (data === null || data === undefined) {
          return new SuccessResponseDto({}, { message: 'No content' });
        }

        return new SuccessResponseDto(data, {
          message: 'Success',
        });
      }),
      catchError((error) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: any = error;

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          message = error.message;

          const response = error.getResponse();
          if (typeof response === 'object' && response !== null) {
            errors = (response as any).message || response;
          } else {
            errors = response;
          }
        }

        // Format error response
        const errorResponse = new ErrorResponseDto(errors, { message });

        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
