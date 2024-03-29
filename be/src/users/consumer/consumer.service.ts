import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Consumer } from '../consumer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialsService } from 'src/materials/materials.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Material } from 'src/materials/materials.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class ConsumerService {
  private consumer: Consumer;
  private material: Material;

  constructor(
    @InjectRepository(Consumer)
    private consumersRepository: Repository<Consumer>,
    private materialsService: MaterialsService,
    private stripeService: StripeService,
    private cartService: CartService,
  ) {}

  async create(): Promise<Consumer> {
    const consumer = new Consumer();
    consumer.cart = await this.cartService.create();
    await this.consumersRepository.save(consumer);
    return consumer;
  }

  findAll(): Promise<Consumer[]> {
    return this.consumersRepository.find();
  }

  findById(id: string): Promise<Consumer | null> {
    return this.consumersRepository.findOneBy({ id: id });
  }

  async addToCart(materialId: string, consumerId: string) {
    const material = await this.materialsService.findOne(materialId);
    let consumer = await this.findById(consumerId);
    consumer = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.cart', 'cart')
      .where('consumer.id = :id', { id: consumer.id })
      .leftJoinAndSelect('cart.materials', 'materials')
      .getOneOrFail();
    if (!consumer.cart.materials) {
      consumer.cart.materials = [];
    }
    consumer.cart.materials.push(material);
    this.consumersRepository.save(consumer);
  }

  async buyMaterial(materialId: string, consumerId: string) {
    this.setConsumer(consumerId);
    this.setMaterial(materialId);
    const material = await this.materialsService.findOne(materialId);
    const session = await this.stripeService.createCheckoutSession({
      priceId: material.stripePriceId,
    });
    return session;
  }

  private async setConsumer(consumerId: string) {
    this.consumer = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.materials', 'materials')
      .where('consumer.id = :id', { id: consumerId })
      .getOneOrFail();
  }
  
  private async setMaterial(materialId: string) {
    this.material = await this.materialsService.findOne(materialId);
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
    console.log(consumerWithMaterials);
    return consumerWithMaterials.materials;
  }

  async getCartItems(id: string): Promise<Material[]> {
    let consumer = await this.findById(id);
    consumer = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.cart', 'cart')
      .where('consumer.id = :id', { id: consumer.id })
      .leftJoinAndSelect('cart.materials', 'materials')
      .getOneOrFail();
    return consumer.cart.materials;
  }

  async removeFromCart(id: string, materialId: string): Promise<Material[]> {
    let consumer = await this.findById(id);
    consumer = await this.consumersRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.cart', 'cart')
      .where('consumer.id = :id', { id: consumer.id })
      .leftJoinAndSelect('cart.materials', 'materials')
      .getOneOrFail();
    consumer.cart.materials = consumer.cart.materials.filter(
      (material) => material.id !== materialId,
    );
    this.consumersRepository.save(consumer);
    return consumer.cart.materials;
  }
}
