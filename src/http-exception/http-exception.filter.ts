import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message:
        typeof message === 'string'
          ? message
          : message['message'] || 'Unknown Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Trả về phản hồi lỗi
    response.status(status).json(errorResponse);
  }
}
