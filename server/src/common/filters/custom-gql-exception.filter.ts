import { BadRequestException, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ClientError } from '../enums/client-error.enum';

export class CustomExceptionFilter
  implements GqlExceptionFilter<HttpException>
{
  catch(exception: Error) {
    return this.transformException(exception);
  }

  private transformException(
    exception: Error & { response?: { type?: ClientError; description?: any } }
  ) {
    if (exception.response?.type) {
      return new BadRequestException(
        `${exception.response.type}/${exception.response.description}`
      );
    }

    if (Number.isNaN(exception['status']) || exception['status'] >= 500) {
      console.log(exception);
    }

    return exception;
  }
}
