import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../common/guards';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class UsersModule {}
