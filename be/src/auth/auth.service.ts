import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/usersService/users.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(
    email: string,
    password: string,
  ) {
    const user = await this.findUser(email);
    const validated = await this.validateUser(email, password);
    if (!validated) {
      throw new UnauthorizedException();
    }
    let { hash, ...userData } = user; 
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async signUp(email: string, password: string): Promise<any> {
    const hash = await this.hashPassword(password);
    this.usersService.create(email, hash);
    return true;
  }

  async findUser(email: string): Promise<User> {
    return this.usersService.findOne(email);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findUser(email);
    console.log(user);
    let result = await bcrypt.compare(password, user.hash);
    if (result === true) {
      let { ...res } = user;
      return result;
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
