import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
const jwt = require('jsonwebtoken');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: any,
        rawJwtToken: any,
        done: any,
      ) => {
        const publicKey = await this.authService.getPublicKey();
        return done(null, publicKey);
      },
    });
  }

  async validate(payload: any): Promise<{ id: string; username: string }> {
    // TODO: check logic
    return { id: payload.sub, username: payload.preferred_username };
  }
}
