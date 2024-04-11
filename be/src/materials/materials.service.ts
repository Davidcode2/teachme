import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './materials.entity';
import * as fs from 'node:fs/promises';
import { StripeService } from 'src/stripe/stripe.service';
import { randomUUID } from 'node:crypto';
import { fromPath } from 'pdf2pic';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
    private stripeService: StripeService,
  ) {}

  findAll(): Promise<Material[]> {
    return this.materialsRepository
      .createQueryBuilder('material')
      .select('material.id')
      .addSelect('material.title')
      .addSelect('material.description')
      .addSelect('material.price')
      .addSelect('material.stripe_price_id')
      .addSelect('material.date_published')
      .getMany();
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

  async create(materialDto: MaterialDto): Promise<Material> {
    let material = new Material();
    material.title = materialDto.title;
    material.description = materialDto.description;
    material.date_published = new Date();
    material.price = Number(materialDto.price);
    material.file_path = this.storeFile(materialDto.file);
    material.thumbnail_path = this.createThumbnail(material.file_path);
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

  async getFile(materialId: string) {
    const material = await this.findOne(materialId);
    return fs.readFile(material.file_path);
  }

  private createThumbnail(pdfPath: string) {
    const options = {
      density: 100,
      saveFilename: `${pdfPath}_thumbnail`,
      savePath: './images',
      format: 'png',
      width: 600,
      height: 600,
    };

    const convert = fromPath(pdfPath, options);
    const pageToConvertAsImage = 1;

    convert(pageToConvertAsImage, { responseType: 'image' }).then((resolve) => {
      console.log('Page 1 is now converted as image');
      return resolve;
    });
    return options.savePath + options.saveFilename + '.' + options.format;
  }

  private storeFile(multerFile: Express.Multer.File) {
    if (!multerFile) {
      return null;
    }
    const file = multerFile.buffer;
    const filePath = randomUUID();
    fs.writeFile(filePath, file);
    return filePath;
  }
}

class MaterialDto {
  file: Express.Multer.File;
  title: string;
  description: string;
  price: string;
  link: string;
}
