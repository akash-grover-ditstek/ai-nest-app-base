import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLike } from '../interfaces/error-like.interface';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorLoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ErrorResponse> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const path = request?.url || '';

    return next.handle().pipe(
      catchError((err: unknown) => {
        let statusCode = 500;
        let message = 'Internal server error';
        let errorName = 'Error';
        let stack: string | undefined;

        if (typeof err === 'object' && err !== null) {
          const errorObj = err as ErrorLike;
          if ('status' in errorObj && typeof errorObj.status === 'number') {
            statusCode = errorObj.status;
          }
          if ('message' in errorObj && typeof errorObj.message === 'string') {
            message = errorObj.message;
          }
          if ('name' in errorObj && typeof errorObj.name === 'string') {
            errorName = errorObj.name;
          }
          if ('stack' in errorObj && typeof errorObj.stack === 'string') {
            stack = errorObj.stack;
          }
        }

        const errorResponse: ErrorResponse = {
          statusCode,
          message,
          timestamp: new Date().toISOString(),
          path,
          error: errorName,
        };
        this.logger.error(
          `Error: ${errorResponse.error} | Status: ${statusCode} | Path: ${path} | Message: ${errorResponse.message}`,
          stack,
        );
        return throwError(() => errorResponse);
      }),
    );
  }
}
