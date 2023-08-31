import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthSession } from './entities';
import { AuthDto } from './dto';

export const AUTH_REPOSITORIES = 'AuthRepositories';

export interface AuthRepositories {
  CreateAuthSession(session: AuthDto): Promise<void>;
}

export class AuthRepositoriesImpl implements AuthRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  async CreateAuthSession(session: AuthDto): Promise<void> {
    const manager = this.datasource.createEntityManager();

    const createSession = manager.create(AuthSession, {
      user_id: session.user_id,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
    });

    await manager.save(createSession);
  }
}
