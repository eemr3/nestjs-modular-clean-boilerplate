import { AppException } from './app.exception';

export class NotFoundError extends AppException {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}
