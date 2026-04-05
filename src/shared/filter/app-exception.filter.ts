import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AppException } from '../../shared/exceptions/app.exception';
import { Request, Response } from 'express';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();

    // Default fallback
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Erro interno do servidor';
    let stack: string | undefined;
    let details: Record<string, unknown> | undefined;

    if (exception instanceof AppException) {
      statusCode = exception.statusCode;
      code = exception.code ?? code;
      message = exception.message;
      stack = exception.stack;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message?: unknown; error?: string; statusCode?: number }
        | unknown;

      // Nest default: { statusCode, message, error }
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object') {
        const r = res as { message?: unknown; error?: string };
        if (Array.isArray(r.message)) {
          message = r.message.join('; ');
        } else if (typeof r.message === 'string') {
          message = r.message;
        } else if (typeof r.error === 'string') {
          message = r.error;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }

      // Mapear status para um code consistente
      code =
        statusCode === HttpStatus.BAD_REQUEST
          ? 'BAD_REQUEST'
          : statusCode === HttpStatus.UNAUTHORIZED
            ? 'UNAUTHORIZED'
            : statusCode === HttpStatus.FORBIDDEN
              ? 'FORBIDDEN'
              : statusCode === HttpStatus.NOT_FOUND
                ? 'NOT_FOUND'
                : statusCode === HttpStatus.CONFLICT
                  ? 'CONFLICT'
                  : statusCode === HttpStatus.TOO_MANY_REQUESTS
                    ? 'TOO_MANY_REQUESTS'
                    : 'HTTP_EXCEPTION';

      if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
        const retryAfterRaw = response.getHeader('Retry-After');
        const retryAfterSeconds =
          typeof retryAfterRaw === 'string'
            ? Number.parseInt(retryAfterRaw, 10)
            : typeof retryAfterRaw === 'number'
              ? retryAfterRaw
              : undefined;

        if (Number.isFinite(retryAfterSeconds)) {
          details = { retryAfterSeconds };
        }
      }

      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message || message;
      stack = exception.stack;
    }

    this.logger.error(
      `[${code}] ${request.method} ${request.url} -> ${statusCode}: ${message}`,
      stack,
    );

    response.status(statusCode).json({
      statusCode,
      code,
      message,
      ...(details ? { details } : {}),
      timestamp,
      path: request.url,
    });
  }
}
