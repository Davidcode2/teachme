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
  stripe_price_id: string;

  @Column({ nullable: true })
  file_path: string

  @Column()
  date_published: Date;
}
