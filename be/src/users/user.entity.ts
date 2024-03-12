import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Consumer } from './consumer.entity';
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

  @Column()
  signUpDate: Date;

  @OneToOne((type) => Consumer)
  @JoinColumn()
  consumer: Consumer;

  @RelationId((user: User) => user.consumer) // you need to specify target relation
  consumerId: string;

  @OneToOne((type) => Author)
  @JoinColumn()
  author: Author;
}
