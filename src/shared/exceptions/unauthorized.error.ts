import { AppException } from './app.exception';

export class UnauthorizedError extends AppException {
  constructor(message: string) {
    super(message, 401, 'UNAUTHORIZED');
  }
}
