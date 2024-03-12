import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Consumer } from '../consumer.entity';
import { Author } from '../author.entity';
import { Material } from 'src/materials/materials.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Consumer)
    private consumerRepository: Repository<Consumer>,
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
    const consumer = await this.createConsumer();
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
    const consumer = await this.consumerRepository.findOneBy({
      id: user.consumerId,
    });
    const consumerWithMaterials = await this.consumerRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.materials', 'materials')
      .where('consumer.id = :id', { id: consumer.id })
      .getOneOrFail();
    console.log(user);
    console.log(consumerWithMaterials);
    return consumerWithMaterials.materials;
  }

  private async createAuthor(): Promise<Author> {
    const author = new Author();
    await this.authorRepository.save(author);
    return author;
  }

  private async createConsumer(): Promise<Consumer> {
    const consumer = new Consumer();
    await this.consumerRepository.save(consumer);
    return consumer;
  }
}
