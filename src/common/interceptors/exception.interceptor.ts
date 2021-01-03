import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  RequestTimeoutException,
  CallHandler,
} from '@nestjs/common';

import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        console.log('\nErrorsInterceptor>catchError>err:\n', err);
        return throwError(err);
      }),
    );
  }
}
