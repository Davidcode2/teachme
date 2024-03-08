import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Consumer } from './consumer.entity';
import { Author } from './author.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  email: string;

  @Column()
  hash: string;

  @Column({nullable: true})
  firstName: string;

  @Column({nullable: true})
  lastName: string;

  @Column()
  signUpDate: Date;

  @OneToOne(type => Consumer)
  @JoinColumn()
  consumer: Consumer;

  @OneToOne(type => Author)
  @JoinColumn()
  author: Author;

}
