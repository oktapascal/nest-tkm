import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const TOKEN_MANAGER_SERVICES = 'TokenManagerServices';

export interface TokenManagerServices {
  NewAccessToken(user_id: string): Promise<string>;
  NewRefreshToken(user_id: string): Promise<string>;
}
@Injectable()
export class TokenManagerServicesImpl implements TokenManagerServices {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  NewAccessToken(user_id: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user_id,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: 60 * 15, // 15 menit
      },
    );
  }

  NewRefreshToken(user_id: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user_id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: 60 * 60 * 24 * 7, // 7 hari
      },
    );
  }
}
