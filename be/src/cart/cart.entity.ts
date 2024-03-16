import { Material } from 'src/materials/materials.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany((type) => Material)
  @JoinTable()
  materials: Material[];
}
