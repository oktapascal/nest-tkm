import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Roles } from '../../common/enums';

export class CreateUserRequest {
  @IsNotEmpty({ message: 'Username wajib diisi' })
  @MaxLength(25, { message: 'Username maksimal $constraint1 karakter' })
  username: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MaxLength(20, { message: 'Password maksimal $constraint1 karakter' })
  password: string;

  @IsNotEmpty({ message: 'Role wajib diisi' })
  @IsEnum(Roles, { message: 'Role tidak valid' })
  role: string;

  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  @MaxLength(100, { message: 'Nama lengkap maksimal $constraint1 karakter' })
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  @MaxLength(14, { message: 'Nomor telepon maksimal $constraint1 karakter' })
  phone_number: string;
}
