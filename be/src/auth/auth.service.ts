import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/usersService/users.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.findUserBy(email);
    const validated = await this.validateUser(email, password);
    if (!validated) {
      throw new UnauthorizedException();
    }
    let { hash, ...userData } = user;
    const tokens = await this.makeTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user: userData, tokens };
  }

  async signUp(email: string, password: string): Promise<any> {
    const hash = await this.hashData(password);
    const user = await this.usersService.create(email, hash);
    const tokens = await this.makeTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return true;
  }

  async logout(userId: string) {
    const user = await this.usersService.findOneById(userId);
    user.refreshToken = null;
    this.usersService.update(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserBy(email);
    let result = await bcrypt.compare(password, user.hash);
    return result;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const { hash, ...user } = await this.usersService.findOneById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this.checkRefreshToken(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.makeTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  private async checkRefreshToken(userRefreshToken: string, refreshToken: string) {
    return await bcrypt.compare(
      refreshToken,
      userRefreshToken,
    );
  }

  private async findUserBy(email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  private async hashData(inputString: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(inputString, salt);
    return hash;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  private async makeTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    console.log(accessToken, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }
}
