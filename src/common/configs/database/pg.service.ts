import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthSession, User, UserProfile } from '../../../users/entities';

export const PgConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    synchronize: false,
    logging: ['warn', 'error'],
    entities: [User, UserProfile, AuthSession],
    host: config.get<string>('DATABASE_HOST'),
    port: config.get<number>('DATABASE_PORT'),
    username: config.get<string>('DATABASE_USER'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME'),
  }),
  dataSourceFactory: async (options) => {
    return await new DataSource(options).initialize();
  },
};
