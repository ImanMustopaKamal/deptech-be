import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("🚀 ~ HttpExceptionFilter ~ catch ~ exception:", exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Error';
    let errors: any = exceptionResponse;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = (exceptionResponse as any).metaData.message || exception.message;
      errors = (exceptionResponse as any).errors || exceptionResponse;
    } else {
      message = exception.message;
    }

    const errorResponse = new ErrorResponseDto(errors, {
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });

    response.status(status).json(errorResponse);
  }
}
