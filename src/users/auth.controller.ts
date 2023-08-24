import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCreateRequest } from './models/web';
import { JsonResponse } from '../common/web';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: CreateUserDto): Promise<JsonResponse> {
    console.log('Test CI');
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
