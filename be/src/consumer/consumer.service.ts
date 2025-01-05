import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Consumer } from './consumer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from '../materials/materials.entity';
import { Cart } from '../cart/cart.entity';
import * as fs from 'node:fs/promises';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(Consumer)
    private consumersRepository: Repository<Consumer>,
  ) {}

  async create(): Promise<Consumer> {
    const consumer = new Consumer();
    consumer.materials = [];
    await this.consumersRepository.save(consumer);
    return consumer;
  }

  findAll(): Promise<Consumer[]> {
    return this.consumersRepository.find();
  }

  findById(id: string): Promise<Consumer | null> {
    return this.consumersRepository.findOneBy({ id: id });
  }

  async addMaterials(materials: Material[], consumerId: string) {
    const consumer = await this.getConsumerWithMaterials(consumerId);
    const addedMaterials = this.findNewMaterials(consumer.materials, materials);
    if (addedMaterials.length === 0) {
      return consumer;
    }
    consumer.materials.push(...addedMaterials);
    this.consumersRepository.save(consumer);
    return consumer;
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

  async getMaterialsWithThumbnails(
    id: string,
  ): Promise<{ material: Material; thumbnail: Buffer }[]> {
    const consumer = await this.findById(id);
    const consumerWithMaterials = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.materials', 'materials')
      .where('consumer.id = :id', { id: consumer.id })
      .getOneOrFail();

    const materialsWithThumbnails = consumerWithMaterials.materials.map(
      async (material) => {
        let thumbnail = await fs.readFile(material.thumbnail_path);
        return { material, thumbnail };
      },
    );
    return Promise.all(materialsWithThumbnails);
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

  async getNumberOfMaterials(id: string): Promise<number> {
    const consumer = await this.getConsumerWithMaterials(id);
    return consumer.materials.length;
  }

  private async getConsumerWithMaterials(id: string) {
    const consumer = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.materials', 'materials')
      .where('consumer.id = :id', { id })
      .getOneOrFail();
    if (!consumer.materials) {
      consumer.materials = [];
      this.consumersRepository.save(consumer);
    }
    return consumer;
  }

  private findNewMaterials(
    existingMaterials: Material[],
    newMaterials: Material[],
  ) {
    const deduplicated = newMaterials.filter(
      (material: Material) =>
        !existingMaterials.some(
          (existing: Material) => existing.id === material.id,
        ),
    );
    return deduplicated;
  }
}
