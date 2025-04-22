import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../author.entity';
import { Material } from '../../materials/materials.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  findOneById(id: string): Promise<Author> {
    return this.authorRepository.findOneBy({ id: id });
  }

  async update(author: Author) {
    this.authorRepository.save(author);
    return author;
  }

  async getMaterials(id: string): Promise<Material[]> {
    const author = await this.findOneById(id);
    const authorWithMaterials = await this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.materials', 'materials')
      .where('author.id = :id', { id: author.id })
      .getOneOrFail();

    return authorWithMaterials.materials;
  }
}
