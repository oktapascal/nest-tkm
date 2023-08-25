import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(private props: any) {
    super(props);
  }
}
