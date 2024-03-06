import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/usersService/users.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string): Promise<any> {
    const hash = await this.hashPassword(password);
    return this.usersService.create(email, hash);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    console.log(user);
    let result = await bcrypt.compare(password, user.hash);
    if (result === true) {
      let {...res} = user;
      return res;
    }
    return result;
  }

  async hashPassword(plainTextPassword: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainTextPassword, salt);
    return hash;
  }
}
