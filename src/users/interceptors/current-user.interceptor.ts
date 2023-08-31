import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { USERS_SERVICES, UsersServices } from '../users.services';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(@Inject(USERS_SERVICES) private userService: UsersServices) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { sub } = request.user || {};

    if (sub) {
      request.currentUser = await this.userService.GetUserById(sub);
    }

    return handler.handle();
  }
}
