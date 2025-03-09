import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/usersService/users.service';
const fetch = require('node-fetch');
const https = require('https');
const bcrypt = require('bcrypt');
const jwkToPem = require('jwk-to-pem');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(userId: string, preferredUsername: string) {
    console.log('trying to log in user: ', userId);
    const user = await this.usersService.findOneById(userId);
    if (!user && userId) {
      console.log('no user user, trying to register');
      console.log('userId: ', userId);
      console.log('preferredUsername: ', preferredUsername);
      this.register(userId, preferredUsername);
    }
  }

  async register(userId: string, preferredUsername: string): Promise<any> {
    const user = await this.usersService.create(userId, preferredUsername);
    console.log('user created: ', user);
    const tokens = await this.makeTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return true;
  }

  async logout(userId: string) {
    const user = await this.usersService.findOneById(userId);
    user.refreshToken = null;
    this.usersService.update(user);
  }

  async verifyTokenWithKeycloak(token: string) {
    const userInfoEndpoint =
      this.configService.get<string>('KEYCLOAK_REALM_URL') +
      this.configService.get<string>('KEYCLOAK_USERINFO_ENDPOINT');
    const res = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
  }

  async getPublicKey() {
    const certsEndpoint =
      this.configService.get<string>('KEYCLOAK_REALM_URL') +
      this.configService.get<string>('KEYCLOAK_CERTS_ENDPOINT');
    const response = await fetch(certsEndpoint, {
      agent: new https.Agent({ rejectUnauthorized: false }), // because of self-signed certificate
    });
    const data = await response.json();
    const jwk = data.keys[0];

    const pem = jwkToPem(jwk);
    return pem;
  }

  private makeRequestBody(token: string) {
    return {
      event: {
        token: token,
        expectedAction: 'LOGIN',
        siteKey: '6LeuYlMqAAAAAAS88977iQmCAxq8coWUbe4Z436W',
      },
    };
  }

  async verifyRecaptcha(token: string) {
    const api_key = this.configService.get<string>('GCLOUD_API_KEY');
    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/teachly-421210/assessments?key=${api_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.makeRequestBody(token)),
      },
    );
    const data = await response.json();
    return data;
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
    return {
      accessToken,
      refreshToken,
    };
  }
}
