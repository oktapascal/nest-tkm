import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities';
import { UsersRepositories } from './users.repositories';
import { CreateUserRequest } from './request';
import { hashing } from '../common/helpers';
import { UserDto, UserProfileDto } from './dto';

export const USERS_SERVICES = 'UsersServices';

export interface UsersServices {
  GetUserByUsername(username: string): Promise<User>;
  GetUserById(user_id: string): Promise<User>;
  SaveUser(user: CreateUserRequest): Promise<void>;
  UpdateRefreshToken(user_id: string, token?: string): Promise<void>;
}

@Injectable()
export class UsersServicesImpl implements UsersServices {
  constructor(
    @Inject('UsersRepositories')
    private readonly userRepository: UsersRepositories,
  ) {}

  GetUserById(user_id: string): Promise<User> {
    return this.userRepository.GetUserById(user_id);
  }

  GetUserByUsername(username: string): Promise<User> {
    return this.userRepository.GetUserByUsername(username);
  }

  async SaveUser(user: CreateUserRequest): Promise<void> {
    const dtoProfile = new UserProfileDto();
    dtoProfile.name = user.name;
    dtoProfile.email = user.email;
    dtoProfile.phone_number = user.phone_number;

    const dtoUser = new UserDto();
    dtoUser.username = user.username;
    dtoUser.role = user.role;
    dtoUser.password = await hashing(user.password);

    return this.userRepository.CreateUser(dtoUser, dtoProfile);
  }

  async UpdateRefreshToken(user_id: string, token?: string): Promise<void> {
    if (token !== null) {
      token = await hashing(token);
    }
    return this.userRepository.UpdateRefreshToken(user_id, token);
  }
}
