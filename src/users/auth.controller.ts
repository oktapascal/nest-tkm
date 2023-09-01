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
  Inject,
} from '@nestjs/common';
import { AUTH_SERVICES, AuthServices } from './auth.services';
import { JsonResponse } from '../common/web';
import { Public } from '../common/decorators';
import { CurrentUser, UserAgent } from './decorators';
import { RefreshTokenGuard } from '../common/guards';
import { LoginRequest, RefreshTokenRequest, RegisterRequest } from './request';
import { Tokens } from './web';
import { Serialize } from '../common/interceptors';
import { UserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICES) private readonly authService: AuthServices,
  ) {}

  @Get('/whoami')
  @Serialize(UserDto)
  whoami(@CurrentUser() user: Express.User) {
    return this.authService.GetCredentialData(user['sub']);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async register(@Body() request: RegisterRequest): Promise<JsonResponse> {
    await this.authService.SignUp(request);

    return {
      code: HttpStatus.CREATED,
      status: 'CREATED',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(
    @Body() request: LoginRequest,
    @Ip() ip_address: string,
    @UserAgent() user_agent: string | undefined,
    @Session() session: any,
  ): Promise<Tokens> {
    request.ip_address = ip_address;
    request.user_agent = user_agent;

    const [access_token, refresh_token] =
      await this.authService.SignIn(request);

    session.access_token = access_token;
    session.refresh_token = refresh_token;

    return { access_token, refresh_token };
  }

  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refresh(
    @CurrentUser() user: Express.User,
    @Session() session: any,
  ): Promise<Tokens> {
    const request = new RefreshTokenRequest();
    request.user_id = user['sub'];
    request.token = user['refresh_token'];

    const [access_token, refresh_token] =
      await this.authService.RefreshToken(request);

    session.access_token = access_token;
    session.refresh_token = refresh_token;

    return { access_token, refresh_token };
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: Express.User): Promise<JsonResponse> {
    await this.authService.SignOut(user['sub']);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}
