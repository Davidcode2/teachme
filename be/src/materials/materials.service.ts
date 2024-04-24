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

  async findAll(): Promise<{ material: Material; thumbnail: Buffer }[]> {
    const materials = await this.materialsRepository
      .createQueryBuilder('material')
      .select('material.id')
      .addSelect('material.title')
      .addSelect('material.description')
      .addSelect('material.price')
      .addSelect('material.stripe_price_id')
      .addSelect('material.thumbnail_path')
      .addSelect('material.date_published')
      .getMany();

    const materialsWithThumbnails = this.mapThumbnails(materials);
    return Promise.all(materialsWithThumbnails);
  }

  findOne(id: string): Promise<Material | null> {
    return this.materialsRepository.findOneBy({ id: id });
  }

  async search(term: string) {
    const materials = await this.materialsRepository
    .createQueryBuilder('material')
    .where('material.title LIKE :term', { term: `%${term}%` })
    .getMany();
    console.log(materials);
    return materials;
  }

  async findOneWithPreview(
    id: string,
  ): Promise<{ material: MaterialUnboughtDto; preview: Buffer[] } | null> {
    const completeMaterial = await this.materialsRepository.findOneBy({
      id: id,
    });
    const { file_path, ...material } = completeMaterial;
    const previewPromises = await this.getPreview(material.preview_path);
    const preview = await Promise.all(previewPromises);
    return { material, preview };
  }

  findMany(ids: string[]): Promise<Material[]> {
    return this.materialsRepository
      .createQueryBuilder('material')
      .where('material.id IN (:...ids)', { ids: ids })
      .getMany();
  }

  async create(materialDto: MaterialDtoIn): Promise<Material> {
    let material = new Material();
    material.title = materialDto.title;
    material.description = materialDto.description;
    material.date_published = new Date();
    material.price = Number(materialDto.price);
    const fileInfo = this.storeFile(materialDto.file);
    material.file_path = fileInfo.filePath;
    material.thumbnail_path = this.createThumbnail(fileInfo);
    material.preview_path = await this.createPreview(fileInfo);
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

  private async createPreview(fileInfo: {
    fileName: string;
    filePath: string;
  }) {
    const options = {
      density: 100,
      saveFilename: `${fileInfo.fileName}_preview`,
      savePath: `assets/previews/${fileInfo.fileName}`,
      format: 'png',
      width: 800,
      height: 600,
    };

    const dir = await fs.mkdir(options.savePath);

    const convert = fromPath(fileInfo.filePath, options);

    convert.bulk(-1, { responseType: 'image' }).then((resolve) => {
      console.log('All pages are now converted to image');
      return resolve;
    });
    return options.savePath;
  }

  private createThumbnail(fileInfo: { fileName: string; filePath: string }) {
    const options = {
      density: 100,
      saveFilename: `${fileInfo.fileName}_thumbnail`,
      savePath: 'assets/images',
      format: 'png',
      width: 800,
      height: 600,
    };

    const convert = fromPath(fileInfo.filePath, options);
    const pageToConvertAsImage = 1;

    convert(pageToConvertAsImage, { responseType: 'image' }).then((resolve) => {
      console.log('Page 1 is now converted as image');
      return resolve;
    });
    return (
      options.savePath +
      '/' +
      options.saveFilename +
      '.' +
      '1.' +
      options.format
    );
  }

  private imageOptions = {};

  private storeFile(multerFile: Express.Multer.File) {
    if (!multerFile) {
      return null;
    }
    const path = 'assets/materials';
    const file = multerFile.buffer;
    const fileName = randomUUID();
    const filePath = `${path}/${fileName}.pdf`;
    fs.writeFile(filePath, file);
    return { fileName, filePath };
  }

  private mapThumbnails(materials: Material[]) {
    const materialsWithThumbnails = materials.map(async (material) => {
      let thumbnail = await fs.readFile(material.thumbnail_path);
      return { material, thumbnail };
    });
    return materialsWithThumbnails;
  }

  private async getPreview(path: string): Promise<Buffer[]> {
    const fileNames: string[] = await fs.readdir(path);
    let fileBuffers = [];
    fileNames.forEach(async (fileName) => {
      const filePath = `${path}/${fileName}`;
      const buffer = fs.readFile(filePath);
      fileBuffers.push(buffer);
    });
    return fileBuffers;
  }
}

class MaterialUnboughtDto {
  title: string;
  description: string;
  price: number;
  link: string;
  id: string;
  stripe_price_id: string;
  thumbnail_path: string;
  preview_path: string;
  date_published: Date;
}

class MaterialDtoIn {
  file: Express.Multer.File;
  title: string;
  description: string;
  price: string;
  link: string;
}
