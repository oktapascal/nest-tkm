export interface SessionUserRequest {
  username: string;
  password: string;
  ip: string;
  agent: string | undefined;
}
