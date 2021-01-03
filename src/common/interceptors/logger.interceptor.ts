import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();
    const [req] = context.getArgs();
    console.log(
      `\n\n---------------------------------------${req.method}::${req.url}---------------------------------------`,
    );
    // console.log('req.headers:\n', req.headers)
    return next.handle().pipe(
      tap(() => {
        console.log(
          `---------------------------------------Done: ${
            Date.now() - now.getTime()
          }ms---------------------------------------`,
        );
      }),
    );
  }
}
