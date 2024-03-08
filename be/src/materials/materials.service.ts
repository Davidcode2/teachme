import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './materials.entity';
import { User } from 'src/users/user.entity';
import { Price } from './price.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
  ) { }

  findAll(): Promise<Material[]> {
    return this.materialsRepository.find();
  }

  findOne(id: number): Promise<Material | null> {
    return this.materialsRepository.findOneBy({ id: id });
  }

  create(user: User, mat: Material): Promise<Material> {
    let material = new Material();
    material.title = mat.title;
    material.author = user;
    material.description = mat.description;
    material.datePublished = new Date();
    return this.materialsRepository.save(material);
  }

  async remove(id: number): Promise<void> {
    await this.materialsRepository.delete(id);
  }

}
