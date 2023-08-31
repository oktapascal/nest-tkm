import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../common/guards';
import { ConfigModule } from '@nestjs/config';
import {
  USERS_REPOSITORIES,
  UsersRepositoriesImpl,
} from './users.repositories';
import { USERS_SERVICES, UsersServicesImpl } from './users.services';
import {
  TOKEN_MANAGER_SERVICES,
  TokenManagerServicesImpl,
} from './token-manager.services';
import { AUTH_REPOSITORIES, AuthRepositoriesImpl } from './auth.repositories';
import { AUTH_SERVICES, AuthServiceImpl } from './auth.services';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: USERS_REPOSITORIES,
      useClass: UsersRepositoriesImpl,
    },
    {
      provide: AUTH_REPOSITORIES,
      useClass: AuthRepositoriesImpl,
    },
    {
      provide: USERS_SERVICES,
      useClass: UsersServicesImpl,
    },
    {
      provide: TOKEN_MANAGER_SERVICES,
      useClass: TokenManagerServicesImpl,
    },
    {
      provide: AUTH_SERVICES,
      useClass: AuthServiceImpl,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class UsersModule {}
