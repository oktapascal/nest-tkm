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
  Session,
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
  async login(
    @Body() request: LoginDto,
    @Ip() ip_address: string,
    @UserAgent() user_agent: string | undefined,
    @Session() session: any,
  ): Promise<Tokens> {
    const req: SessionUserRequest = {
      ...request,
      ip: ip_address,
      agent: user_agent,
    };

    const result = await this.authService.handleLogin(req);

    session.access_token = result.access_token;
    session.refresh_token = result.refresh_token;

    return { ...result };
  }

  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refresh(
    @CurrentUser() user: Express.User,
    @Session() session: any,
  ): Promise<Tokens> {
    const req: RefreshTokenRequest = {
      user_id: user['sub'],
      token: user['refresh_token'],
    };

    const result = await this.authService.handleRefreshToken(req);

    session.access_token = result.access_token;
    session.refresh_token = result.refresh_token;

    return { ...result };
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: Express.User): Promise<JsonResponse> {
    await this.authService.handleLogout(user['sub']);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}
