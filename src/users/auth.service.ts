import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UserCreateRequest } from './models/web';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {}

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
