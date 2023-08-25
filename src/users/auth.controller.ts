import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UserCreateRequest } from './models/web';
import { JsonResponse } from '../common/web';
import { Public } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async register(@Body() request: CreateUserDto): Promise<JsonResponse> {
    const req: UserCreateRequest = {
      ...request,
    };

    await this.authService.handleRegister(req);

    return {
      code: HttpStatus.CREATED,
      status: 'CREATED',
    };
  }
}
