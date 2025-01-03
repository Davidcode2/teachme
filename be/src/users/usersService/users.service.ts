import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Author } from '../author.entity';
import { Material } from '../../materials/materials.entity';
import { ConsumerService } from '../../consumer/consumer.service';
const jdenticon = require('jdenticon');
import * as fs from 'node:fs/promises';
import { AuthorService } from '../author/author.service';
import { UpdateUserDto } from 'src/shared/DTOs/updatedUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private consumerService: ConsumerService,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    private authorService: AuthorService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.usersRepository.findOneBy({ email: email });
  }

  findOneByAuthorId(authorId: string): Promise<User | null> {
    if (authorId) {
      return this.usersRepository.findOneBy({ author: { id: authorId } });
    }
    return null;
  }

  async findOneById(id: string): Promise<User | null> {
    if (!id) return null;
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) return null;
    user.consumer = await this.consumerService.findById(user.consumerId);
    user.consumer.materials = await this.consumerService.getMaterials(
      user.consumerId,
    );
    user.consumer.cart = await this.consumerService.getCart(user.consumerId);
    user.author = await this.authorRepository.findOneBy({ id: user.authorId });
    user.author.materials = await this.authorService.getMaterials(
      user.authorId,
    );
    return user;
  }

  async create(email: string, hash: string): Promise<User> {
    const isDuplicate = await this.usersRepository.existsBy({ email: email });
    if (isDuplicate) throw new Error('Email address is already in use');
    const user = new User();
    const consumer = await this.consumerService.create();
    const author = await this.createAuthor();
    user.email = email;
    user.hash = hash;
    user.signUpDate = new Date();
    user.author = author;
    user.consumer = consumer;
    user.avatar = this.createAvatar(email);
    return this.usersRepository.save(user);
  }

  async updateWithAuthor(user: User): Promise<User> {
    this.authorService.update(user.author);
    return this.usersRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async partialUpdate(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOneById(userId);
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
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
    user.consumer = await this.consumerService.addMaterials(
      materials,
      consumerId,
    );
    this.usersRepository.save(user);
  }

  async getAvatarPath(userId: string): Promise<string> {
    const user = await this.findOneById(userId);
    return user.avatar;
  }

  private async createAuthor(): Promise<Author> {
    const author = new Author();
    author.materials = [];
    await this.authorRepository.save(author);
    return author;
  }

  private createAvatar(name: string): string {
    const size = 200;
    const png = jdenticon.toPng(name, size);
    const avatarsFolder = 'assets/avatars';
    const filePath = `${avatarsFolder}/${name}.png`;
    fs.writeFile(filePath, png);
    return filePath;
  }
}
