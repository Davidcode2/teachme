import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Consumer } from '../consumer.entity';
import { Author } from '../author.entity';
import { Material } from 'src/materials/materials.entity';
import { ConsumerService } from '../consumer/consumer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private consumerService: ConsumerService,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async create(email: string, hash: string): Promise<User> {
    let user = new User();
    const consumer = await this.consumerService.create();
    const author = await this.createAuthor();
    user.email = email;
    user.hash = hash;
    user.signUpDate = new Date();
    user.author = author;
    user.consumer = consumer;
    console.log(user);
    return this.usersRepository.save(user);
  }

  async findHash(email: string): Promise<string | null> {
    return this.usersRepository.findOneBy({ email: email }).then((user) => {
      return user.hash;
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getMaterials(id: string): Promise<Material[]> {
    const user = await this.findOneById(id);
    const materials = this.consumerService.getMaterials(user.consumerId);
    return materials;
  }

  async getCartItems(id: string): Promise<Material[]> {
    const user = await this.findOneById(id);
    const materials = this.consumerService.getCartItems(user.consumerId);
    return materials;
  }


  private async createAuthor(): Promise<Author> {
    const author = new Author();
    await this.authorRepository.save(author);
    return author;
  }

}
