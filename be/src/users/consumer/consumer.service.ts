import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Consumer } from '../consumer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialsService } from 'src/materials/materials.service';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(Consumer)
    private consumersRepository: Repository<Consumer>,
    private materialsService: MaterialsService,
    private stripeService: StripeService,
  ) { }

  findAll(): Promise<Consumer[]> {
    return this.consumersRepository.find();
  }

  findById(id: string): Promise<Consumer | null> {
    return this.consumersRepository.findOneBy({id: id});
  }

  async addMaterial(materialId: string, consumerId: string) {
    const material = await this.materialsService.findOne(materialId);
    const consumer = await this.consumersRepository
    .createQueryBuilder('consumer')
    .leftJoinAndSelect('consumer.materials', 'materials')
    .where('consumer.id = :id', { id: consumerId })
    .getOneOrFail();

    const session = await this.stripeService.createCheckoutSession({priceId: material.stripePriceId});
    if (!consumer.materials) {
      consumer.materials = [];
    }
    consumer.materials.push(material);
    this.consumersRepository.save(consumer);
    return session;
  }

}
