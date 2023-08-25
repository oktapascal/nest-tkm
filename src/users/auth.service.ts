import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { Tokens, UserCreateRequest } from './models/web';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {}

  private async generateTokens(id_user: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id_user,
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: 60 * 15, // 15 menit
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id_user,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: 60 * 60 * 24 * 7, // 7 hari
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async handleRegister(request: UserCreateRequest) {
    const user = await this.userService.findByUsername(request.username);

    if (user)
      throw new BadRequestException([
        {
          field: 'username',
          error: 'Username yang sama sudah terdaftar',
        },
      ]);

    return this.userService.create(request);
  }
}
