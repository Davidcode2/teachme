import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Material } from './materials.entity';
import * as fs from 'node:fs/promises';
import { StripeService } from '../stripe/stripe.service';
import { randomUUID } from 'node:crypto';
import { UsersService } from '../users/usersService/users.service';
import { ImageService } from './image.service';
import { MaterialUnboughtDto } from 'src/shared/Models/MaterialsUnbought';
import PaginationObject from 'src/shared/DTOs/paginationObject';
import MaterialDtoIn from 'src/shared/Models/MaterialsIn';
import { User } from 'src/users/user.entity';
import MaterialWithThumbnail from 'src/shared/Models/MaterialsWithThumbnails';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
    private stripeService: StripeService,
    private userService: UsersService,
    private imageService: ImageService,
  ) {}

  async findAll(
    pagination: PaginationObject,
  ): Promise<MaterialWithThumbnail[]> {
    const materialsCount = await this.materialsRepository.count();
    const take = this.amountToTake(materialsCount, pagination);
    const skip =
      materialsCount - pagination.offset > 0
        ? pagination.offset
        : materialsCount - pagination.pageSize;
    if (take === null) {
      return [];
    }
    const materialsQuery = this.createMaterialsQuery();
    const paginatedQuery = materialsQuery.skip(skip).take(take);
    const materials = await paginatedQuery.getMany();

    return this.mapThumbnails(materials);
  }

  findOne(id: string): Promise<Material | null> {
    return this.materialsRepository.findOneBy({ id: id });
  }

  async findByCreator(userId: string): Promise<MaterialWithThumbnail[]> {
    const user = await this.userService.findOneById(userId);
    console.log(user);
    const materials = user.author.materials;
    return this.mapThumbnails(materials);
  }

  async findByUser(
    userId: string,
    searchString: string,
  ): Promise<MaterialWithThumbnail[]> {
    const materials = await this.getMaterialsForUser(userId);
    if (searchString) {
      return this.searchMyMaterials(searchString, materials);
    }
    return this.mapThumbnails(materials);
  }

  async delete(id: string) {
    const material = await this.materialsRepository.findOneBy({ id: id });
    if (!material) {
      return null;
    }
    //await this.stripeService.deleteProduct(material.stripe_price_id);
    await this.materialsRepository.delete(id);
    return material;
  }

  private async getMaterialsForUser(userId: string) {
    const user = await this.userService.findOneById(userId);
    const materials = user.consumer.materials;
    return materials;
  }

  private searchMyMaterials(searchString: string, materials: Material[]) {
    const filteredMaterials = materials.filter((material) =>
      material.title.includes(searchString),
    );
    return this.mapThumbnails(filteredMaterials);
  }

  async search(term: string) {
    const materials = await this.materialsRepository
      .createQueryBuilder('material')
      .where('material.title LIKE :term', { term: `%${term}%` })
      .getMany();
    const unboughtMaterials = materials.map((material) => {
      const { file_path, ...unboughtMaterial } = material;
      return unboughtMaterial;
    });
    return this.mapThumbnails(unboughtMaterials);
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

  async create(materialDto: MaterialDtoIn) {
    const material = await this.populateMaterial(materialDto);
    const user = await this.userService.findOneById(materialDto.userId);
    material.author_id = user.authorId;
    await this.materialsRepository.save(material);
    this.addMaterialToAuthor(user, material);
  }

  private addMaterialToAuthor(user: User, material: Material) {
    user.author.materials.push(material);
    this.userService.updateWithAuthor(user);
    console.log(user);
  }

  private async populateMaterial(materialDto: MaterialDtoIn) {
    try {
      const material = new Material();
      material.title = materialDto.title;
      material.description = materialDto.description;
      material.date_published = new Date();
      material.price = Number(materialDto.price);
      const fileInfo = this.storeFile(materialDto.file);
      material.file_path = fileInfo.filePath;
      try {
        material.thumbnail_path =
          await this.imageService.createThumbnail(fileInfo);
      } catch (error) {
        throw new Error('thumbnail creation failed');
      }
      try {
        material.preview_path = await this.imageService.createPreview(fileInfo);
      } catch (error) {
        throw new Error('preview creation failed');
      }
      const price = await this.stripeService.createProduct(material);
      material.stripe_price_id = price.id;
      return material;
    } catch (error) {
      throw new Error('material creation failed');
    }
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

  public mapThumbnails(materials: Material[] | MaterialUnboughtDto[]) {
    const materialsWithThumbnails = materials.map(async (material: any) => {
      const thumbnail = await fs.readFile(material.thumbnail_path);
      return { material, thumbnail };
    });
    return Promise.all(materialsWithThumbnails);
  }

  private async getPreview(path: string): Promise<Buffer[]> {
    const fileNames: string[] = await fs.readdir(path);
    const fileBuffers = [];
    fileNames.forEach(async (fileName) => {
      const filePath = `${path}/${fileName}`;
      const buffer = fs.readFile(filePath);
      fileBuffers.push(buffer);
    });
    return fileBuffers;
  }

  private createMaterialsQuery(): SelectQueryBuilder<Material> {
    const selectQueryBuilder = this.materialsRepository
      .createQueryBuilder('material')
      .select('material.id')
      .addSelect('material.title')
      .addSelect('material.description')
      .addSelect('material.price')
      .addSelect('material.stripe_price_id')
      .addSelect('material.thumbnail_path')
      .addSelect('material.date_published')
      .addSelect('material.author_id');

    return selectQueryBuilder;
  }

  private amountToTake(
    numberOfMaterials: number,
    pagination: PaginationObject,
  ) {
    if (pagination.offset >= numberOfMaterials) {
      return null;
    }
    if (pagination.limit === 0) {
      return pagination.pageSize;
    }
    return pagination.limit;
  }
}
