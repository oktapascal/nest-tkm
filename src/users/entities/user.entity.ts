import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ generated: 'uuid' })
  id_user: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  activated: boolean;

  @Column({ nullable: true })
  created_at: string;

  @Column({ nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  remember_token: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  @JoinColumn({ name: 'id_user', referencedColumnName: 'user_id' })
  profile: UserProfile;
}
