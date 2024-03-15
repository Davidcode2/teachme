import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Material {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({nullable: true})
  price: number;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  stripePriceId: string;

  @Column()
  datePublished: Date;
}
