import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Author } from '../author.entity';
import { Material } from 'src/materials/materials.entity';
import { ConsumerService } from '../../consumer/consumer.service';
import { MaterialDto } from 'src/shared/DTOs/materialDTO';

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
    if (!email) return null;
    return this.usersRepository.findOneBy({ email: email });
  }

  async findOneById(id: string): Promise<User | null> {
    if (!id) return null;
    let user = await this.usersRepository.findOneBy({ id: id });
    user.consumer = await this.consumerService.findById(user.consumerId);
    user.consumer.materials = await this.consumerService.getMaterials(
      user.consumerId,
    );
    user.consumer.cart = await this.consumerService.getCart(user.consumerId);
    return user;
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
    return this.usersRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<User> {
    return this.usersRepository.save({ id: id, refreshToken: refreshToken });
  }

  async findHash(email: string): Promise<string | null> {
    return this.usersRepository.findOneBy({ email: email }).then((user) => {
      return user.hash;
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async addMaterials(materials: Material[], userId: string) {
    const user = await this.findOneById(userId);
    const consumerId = user.consumerId;
    user.consumer = await this.consumerService.addMaterials(materials, consumerId);
    this.usersRepository.save(user);
  }

  async getMaterials(id: string): Promise<MaterialDto[]> {
    const user = await this.findOneById(id);
    const materials = this.consumerService.getMaterialsWithThumbnails(user.consumerId);
    return materials;
  }

  private async createAuthor(): Promise<Author> {
    const author = new Author();
    await this.authorRepository.save(author);
    return author;
  }
}
