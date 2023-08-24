import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode, statusMessage } = res;
      if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
        const message = `[${method}] ${originalUrl} [${statusCode}]: ${statusMessage}`;

        this.logger.warn(message);
      }
    });

    next();
  }
}
