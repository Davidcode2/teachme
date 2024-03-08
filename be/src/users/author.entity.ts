import { Material } from 'src/materials/materials.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToMany((type) => Material)
  @JoinTable()
  materials: Material[];
}
