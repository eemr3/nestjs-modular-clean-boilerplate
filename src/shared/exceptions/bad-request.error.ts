import { AppException } from './app.exception';

export class BadRequestError extends AppException {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST');
  }
}
