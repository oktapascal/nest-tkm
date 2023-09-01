import { Expose, Type } from 'class-transformer';

export class UserProfileDto {
  user_id?: string;

  @Expose()
  name: string;

  @Expose()
  email?: string;

  @Expose()
  phone_number?: string;

  @Expose()
  photo?: string;

  updated_at?: Date;
}

export class UserDto {
  @Expose()
  id?: number;

  @Expose()
  id_user?: string;

  @Expose()
  username: string;

  password: string;

  @Expose()
  role: string;

  @Expose()
  activated?: boolean;

  updated_at?: Date;

  @Expose()
  @Type(() => UserProfileDto)
  profile: UserProfileDto;
}
