import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { SessionUserRequest, Tokens, UserCreateRequest } from './models/web';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { verify } from '../common/helpers';
import { AuthSession } from './models/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UsersService,
    @InjectDataSource() private readonly datasource: DataSource,
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

  async handleLogin(request: SessionUserRequest): Promise<Tokens> {
    // check username is existed or not
    const user = await this.userService.findByUsername(request.username);

    if (!user)
      throw new NotFoundException([
        { field: 'username', error: 'user tidak ditemukan' },
      ]);

    // compare password encrypt
    const isVerified = verify(user.password, request.password);

    if (!isVerified)
      throw new UnauthorizedException([
        {
          field: 'password',
          error: 'password tidak sesuai dengan credential anda',
        },
      ]);

    const tokens = this.generateTokens(user.id_user);

    const manager = this.datasource.createEntityManager();
    const session = manager.create(AuthSession, {
      user_id: user.id_user,
      ip_address: request.ip,
      user_agent: request.agent,
    });

    await manager.save(session);

    return tokens;
  }
}
