import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Consumer } from './consumer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from 'src/materials/materials.entity';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class ConsumerService {
  private consumer: Consumer;
  private material: Material;

  constructor(
    @InjectRepository(Consumer)
    private consumersRepository: Repository<Consumer>,
  ) {}

  async create(): Promise<Consumer> {
    const consumer = new Consumer();
    await this.consumersRepository.save(consumer);
    return consumer;
  }

  findAll(): Promise<Consumer[]> {
    return this.consumersRepository.find();
  }

  findById(id: string): Promise<Consumer | null> {
    return this.consumersRepository.findOneBy({ id: id });
  }

  async addMaterial() {
    if (!this.consumer.materials) {
      this.consumer.materials = [];
    }
    this.consumer.materials.push(this.material);
    this.consumersRepository.save(this.consumer);
  }

  async getMaterials(id: string): Promise<Material[]> {
    const consumer = await this.findById(id);
    const consumerWithMaterials = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.materials', 'materials')
      .where('consumer.id = :id', { id: consumer.id })
      .getOneOrFail();
    return consumerWithMaterials.materials;
  }

  async getCart(id: string): Promise<Cart> {
    let consumer = await this.findById(id);
    consumer = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.cart', 'cart')
      .where('consumer.id = :id', { id: consumer.id })
      .leftJoinAndSelect('cart.materials', 'materials')
      .getOneOrFail();
    return consumer.cart;
  }

}

