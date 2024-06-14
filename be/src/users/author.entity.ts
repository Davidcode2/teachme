import { Material } from '../materials/materials.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany((type) => Material)
  @JoinTable()
  materials: Material[];
}
