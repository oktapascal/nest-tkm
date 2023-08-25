export interface SessionUserRequest {
  username: string;
  password: string;
  ip: string;
  agent: string | undefined;
}

export interface RefreshTokenRequest {
  user_id: string;
  token: string;
}
