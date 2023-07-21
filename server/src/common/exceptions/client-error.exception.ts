import { BadRequestException } from '@nestjs/common';
import { ClientError } from '../enums/client-error.enum';

export class ClientErrorException extends BadRequestException {
  constructor(type: ClientError, description?: any) {
    super({ type, description });
  }
}
