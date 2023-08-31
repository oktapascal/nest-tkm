import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  photo: string;

  @Column()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id_user' })
  user: User;
}
