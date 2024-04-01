import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './materials.entity';
import { User } from 'src/users/user.entity';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
    private stripeService: StripeService,
  ) {}

  findAll(): Promise<Material[]> {
    return this.materialsRepository.find();
  }

  findOne(id: string): Promise<Material | null> {
    return this.materialsRepository.findOneBy({ id: id });
  }

  findMany(ids: string[]): Promise<Material[]> {
    return this.materialsRepository
      .createQueryBuilder('material')
      .where('material.id IN (:...ids)', { ids: ids })
      .getMany();
  }

  async create(user: User, mat: MaterialDto): Promise<Material> {
    let material = new Material();
    material.title = mat.title;
    material.description = mat.description;
    material.date_published = new Date();
    material.price = Number(mat.price);
    const price = await this.stripeService.createProduct(material);
    material.stripe_price_id = price.id;
    return this.materialsRepository.save(material);
  }

  async remove(id: string): Promise<void> {
    await this.materialsRepository.delete(id);
  }

  async findByStripePriceIds(stripeIds: string[]): Promise<Material[] | null> {
    return this.materialsRepository
      .createQueryBuilder('material')
      .where('material.stripe_price_id IN (:...stripeIds)', {
        stripeIds: stripeIds,
      })
      .getMany();
  }
}

class MaterialDto {
  title: string;
  description: string;
  price: string;
  link: string;
}
