import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Price } from './price.entity';

@Entity()
export class Material {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column()
  datePublished: Date;
}
