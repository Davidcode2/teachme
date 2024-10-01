import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../author.entity';

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
}
