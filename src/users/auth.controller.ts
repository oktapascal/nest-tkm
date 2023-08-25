import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto';
import {
  RefreshTokenRequest,
  SessionUserRequest,
  Tokens,
  UserCreateRequest,
} from './models/web';
import { JsonResponse } from '../common/web';
import { Public } from '../common/decorators';
import { LoginDto } from './dto/login.dto';
import { CurrentUser, UserAgent } from './decorators';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { RefreshTokenGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/whoami')
  @Serialize(UserDto)
  whoami(@CurrentUser() user: Express.User) {
    return user['sub'];
  }

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

  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  refresh(@CurrentUser() user: Express.User): Promise<Tokens> {
    const req: RefreshTokenRequest = {
      user_id: user['sub'],
      token: user['refresh_token'],
    };

    return this.authService.handleRefreshToken(req);
  }
}
