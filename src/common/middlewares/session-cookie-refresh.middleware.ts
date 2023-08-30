import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SessionCookieRefreshMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cookieSession = req.session;
    if (cookieSession && !req.headers['authorization']) {
      req.headers = {
        ...req.headers,
        authorization: `Bearer ${cookieSession.refresh_token}`,
      };
    }

    next();
  }
}
