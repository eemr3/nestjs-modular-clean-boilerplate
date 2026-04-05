import { AppException } from './app.exception';

export class ForbiddenError extends AppException {
  constructor(message: string) {
    super(message, 403, 'FORBIDDEN');
  }
}
