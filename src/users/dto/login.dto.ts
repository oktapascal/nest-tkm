import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'username wajib diisi' })
  username: string;

  @IsNotEmpty({ message: 'password wajib diisi' })
  password: string;
}
