import { Cart } from 'src/cart/cart.entity';
import { Material } from 'src/materials/materials.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Consumer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany((type) => Material)
  @JoinTable()
  materials: Material[];

  @OneToOne(() => Cart, { cascade: true })
  @JoinColumn()
  cart: Cart;
}
