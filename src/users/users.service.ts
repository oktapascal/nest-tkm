import { Injectable } from '@nestjs/common';
import { UserCreateRequest } from './models/web';
import { hashing } from '../common/helpers';
import { DataSource } from 'typeorm';
import { User, UserProfile } from './models/entities';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  findByUsername(username: string) {
    return this.datasource
      .getRepository(User)
      .createQueryBuilder()
      .where('username = :username', { username })
      .andWhere('activated = true')
      .getOne();
  }

  findUserById(user_id: string) {
    return this.datasource
      .getRepository(User)
      .createQueryBuilder()
      .where('id_user = :user_id', { user_id })
      .andWhere('activated = true')
      .getOne();
  }

  create(data: UserCreateRequest) {
    const initialize: UserCreateRequest = {
      ...data,
      password: hashing(data.password),
    };

    const manager = this.datasource.createEntityManager();

    return this.datasource.transaction(async (trx) => {
      const user = manager.create(User, {
        username: initialize.username,
        password: initialize.password,
        role: initialize.role,
      });

      const result = await trx.save(user);

      const profile = manager.create(UserProfile, {
        user_id: result.id_user,
        name: initialize.name,
      });

      await trx.save(profile);
    });
  }

  updateRefreshToken(user_id: string, token?: string) {
    let hashToken: string | null = null;
    if (token) hashToken = hashing(token);

    return this.datasource
      .createQueryBuilder()
      .update(User)
      .set({ remember_token: hashToken })
      .where('id_user = :user_id', { user_id })
      .execute();
  }
}
