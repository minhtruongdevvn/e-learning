import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, catchError } from 'rxjs';
import { ClientErrorException } from '../exceptions/client-error.exception';

export class PrismaExceptionTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002':
              throw new ClientErrorException(
                'EXISTED',
                `existing ${error.meta.target}`
              );
            case 'P2025':
              throw new ClientErrorException(
                'NOT_FOUND',
                `${error.meta.cause}`
              );
            default:
              break;
          }
        }

        throw error;
      })
    );
  }
}
