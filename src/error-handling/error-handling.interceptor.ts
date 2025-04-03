import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => {
        // Tùy chỉnh phản hồi thành công
        const request = context.switchToHttp().getRequest<Request>();
        const path = request.url;
        const timestamp = new Date().toISOString();
        return {
          statusCode: 200,
          message: 'Request was successful',
          result: data, // Dữ liệu thực tế trả về
          timestamp,
          path,
        };
      }),
    );
    // return next.handle().pipe(
    //   catchError((error): Observable<T> => {
    //     const request = context.switchToHttp().getRequest<Request>();
    //     const path = request.url;
    //     const timestamp = new Date().toISOString();
    //
    //     console.log('test', timestamp);
    //     // Xử lý lỗi HttpException
    //     if (error instanceof HttpException) {
    //       const response = error.getResponse();
    //       const status = error.getStatus();
    //
    //       // Kiểm tra kiểu response
    //       let message: string;
    //       if (typeof response === 'string') {
    //         message = response; // Nếu response là chuỗi
    //       } else {
    //         message =
    //           (response as { message?: string }).message || 'Unknown Error'; // Lấy message từ đối tượng
    //       }
    //       return throwError(() => ({
    //         statusCode: status,
    //         message,
    //         timestamp,
    //         path,
    //       })); // as Observable<T>;
    //     }
    //
    //     // Xử lý lỗi không phải HttpException
    //     return throwError(() => ({
    //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //       message: 'Internal server error',
    //       timestamp: timestamp,
    //       path: path,
    //     })); // as Observable<T>;
    //   }),
    // );
  }
}
