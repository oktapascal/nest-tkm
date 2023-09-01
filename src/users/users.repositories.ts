import { User, UserProfile } from './entities';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDto, UserProfileDto } from './dto';

export const USERS_REPOSITORIES = 'UsersRepositories';

export interface UsersRepositories {
  GetUserByUsername(username: string): Promise<User>;
  GetUserById(user_id: string): Promise<User>;
  CreateUser(user: UserDto, profile: UserProfileDto): Promise<void>;
  UpdateRefreshToken(user_id: string, token?: string): Promise<void>;
}

@Injectable()
export class UsersRepositoriesImpl implements UsersRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}
  CreateUser(user: UserDto, profile: UserProfileDto): Promise<void> {
    const manager = this.datasource.createEntityManager();

    return this.datasource.transaction(async (trx) => {
      const createUser = manager.create(User, {
        username: user.username,
        password: user.password,
        role: user.role,
      });

      const _user = await trx.save(createUser);

      const createProfile = manager.create(UserProfile, {
        user_id: _user.id_user,
        name: profile.name,
      });

      await trx.save(createProfile);
    });
  }

  GetUserById(user_id: string): Promise<User> {
    return this.datasource
      .getRepository(User)
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.profile', 'profile')
      .where('id_user = :user_id', { user_id })
      .andWhere('activated = true')
      .getOne();
  }

  GetUserByUsername(username: string): Promise<User> {
    return this.datasource
      .getRepository(User)
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.profile', 'profile')
      .where('username = :username', { username })
      .andWhere('activated = true')
      .getOne();
  }

  async UpdateRefreshToken(user_id: string, token?: string): Promise<void> {
    await this.datasource
      .createQueryBuilder()
      .update(User)
      .set({ remember_token: token })
      .where('id_user = :user_id', { user_id })
      .execute();
  }
}
