import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from '../common/helpers';
import { USERS_SERVICES, UsersServices } from './users.services';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  CreateUserRequest,
} from './request';
import { AUTH_REPOSITORIES, AuthRepositories } from './auth.repositories';
import {
  TOKEN_MANAGER_SERVICES,
  TokenManagerServices,
} from './token-manager.services';
import { plainToInstance } from 'class-transformer';
import { AuthDto } from './dto';

export const AUTH_SERVICES = 'AuthServices';

export interface AuthServices {
  RefreshToken(auth: RefreshTokenRequest): Promise<string[]>;
  SignUp(auth: RegisterRequest): Promise<void>;
  SignIn(auth: LoginRequest): Promise<string[]>;
  SignOut(user_id: string): Promise<void>;
}

@Injectable()
export class AuthServiceImpl implements AuthServices {
  constructor(
    @Inject(USERS_SERVICES)
    private readonly userServices: UsersServices,
    @Inject(TOKEN_MANAGER_SERVICES)
    private readonly tokenmanagerServices: TokenManagerServices,
    @Inject(AUTH_REPOSITORIES)
    private readonly authRepositories: AuthRepositories,
  ) {}

  async RefreshToken(auth: RefreshTokenRequest): Promise<string[]> {
    const user = await this.userServices.GetUserById(auth.user_id);

    if (!user) throw new ForbiddenException('Access Denied');

    if (user.remember_token === null)
      throw new ForbiddenException('Access Denied');

    const isVerified = await verify(user.remember_token, auth.token);

    if (!isVerified) throw new ForbiddenException('Access Denied');

    const accessToken = await this.tokenmanagerServices.NewAccessToken(
      user.id_user,
    );

    const refreshToken = await this.tokenmanagerServices.NewRefreshToken(
      user.id_user,
    );

    await this.userServices.UpdateRefreshToken(auth.user_id, refreshToken);

    return [accessToken, refreshToken];
  }

  async SignIn(auth: LoginRequest): Promise<string[]> {
    const user = await this.userServices.GetUserByUsername(auth.username);

    if (!user)
      throw new NotFoundException([
        { field: 'username', error: 'user tidak ditemukan' },
      ]);

    const isVerified = await verify(user.password, auth.password);

    if (!isVerified)
      throw new UnauthorizedException([
        {
          field: 'password',
          error: 'password tidak sesuai dengan credential anda',
        },
      ]);

    const accessToken = await this.tokenmanagerServices.NewAccessToken(
      user.id_user,
    );

    const refreshToken = await this.tokenmanagerServices.NewRefreshToken(
      user.id_user,
    );

    await this.userServices.UpdateRefreshToken(user.id_user, refreshToken);

    const dto = plainToInstance(AuthDto, auth);
    await this.authRepositories.CreateAuthSession(dto);

    return [accessToken, refreshToken];
  }

  SignOut(user_id: string): Promise<void> {
    return this.userServices.UpdateRefreshToken(user_id, null);
  }

  async SignUp(auth: RegisterRequest): Promise<void> {
    const user = await this.userServices.GetUserByUsername(auth.username);

    if (user)
      throw new BadRequestException([
        {
          field: 'username',
          error: 'Username yang sama sudah terdaftar',
        },
      ]);

    const request = new CreateUserRequest();
    request.name = auth.name;
    request.username = auth.username;
    request.role = auth.role;
    request.password = auth.password;

    return this.userServices.SaveUser(request);
  }
}
