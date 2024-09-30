import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Consumer } from '../consumer/consumer.entity';
import { Author } from './author.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  signUpDate: Date;

  @OneToOne((type) => Consumer, { cascade: true })
  @JoinColumn()
  consumer: Consumer;

  @RelationId((user: User) => user.consumer)
  consumerId: string;

  @OneToOne((type) => Author)
  @JoinColumn()
  author: Author;
}
