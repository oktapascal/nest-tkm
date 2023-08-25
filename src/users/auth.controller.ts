import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { SessionUserRequest, Tokens, UserCreateRequest } from './models/web';
import { JsonResponse } from '../common/web';
import { Public } from '../common/decorators';
import { LoginDto } from './dto/login.dto';
import { UserAgent } from './decorators';

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  login(
    @Body() request: LoginDto,
    @Ip() ip_address: string,
    @UserAgent() user_agent: string | undefined,
  ): Promise<Tokens> {
    const req: SessionUserRequest = {
      ...request,
      ip: ip_address,
      agent: user_agent,
    };

    return this.authService.handleLogin(req);
  }
}
