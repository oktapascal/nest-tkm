import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'username wajib diisi' })
  username: string;

  @IsNotEmpty({ message: 'password wajib diisi' })
  password: string;

  @IsOptional()
  ip_address: string;

  @IsOptional()
  user_agent: string | undefined;
}
