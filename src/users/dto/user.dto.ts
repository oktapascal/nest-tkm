export class UserDto {
  id?: number;
  id_user?: string;
  username: string;
  password: string;
  role: string;
  name: string;
  remember_token?: string;
  activated?: boolean;
  updated_at?: Date;
}
