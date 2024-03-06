import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  create(email: string, hash: string): Promise<User> {
    let user = new User();
    user.email = email;
    user.hash = hash;
    user.signUpDate = new Date();
    let {...res} = user;
    console.log(res);
    return this.usersRepository.save(user);
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
