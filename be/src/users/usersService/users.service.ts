import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Consumer } from '../consumer.entity';
import { Author } from '../author.entity';

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

  findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  findOneById(id: number): Promise<User | null> {
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
    let { ...res } = user;
    return this.usersRepository.save(user);
  }

  async createAuthor(): Promise<Author> {
    const author = new Author();
    await this.authorRepository.save(author);
    return author;
  }

  async createConsumer(): Promise<Consumer> {
    const consumer = new Consumer();
    await this.consumerRepository.save(consumer);
    return consumer;
  }


  async findHash(email: string): Promise<string | null> {
    return this.usersRepository.findOneBy({ email: email }).then((user) => {
      return user.hash;
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
