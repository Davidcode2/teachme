import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const fetch = require('node-fetch');
const https = require('https');
const jwkToPem = require('jwk-to-pem');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private publicKeyCache: { [kid: string]: string } = {}; // Cache for keys
  private cacheExpiration: Date | null = null;
  private readonly cacheDuration = 60 * 60 * 1000;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: any,
        rawJwtToken: any,
        done: any,
      ) => {
        const publicKey = await this.getPublicKey(rawJwtToken);
        if (!publicKey) {
          return done(new Error('Public key not found for this token'), null);
        }
        return done(null, publicKey);
      },
    });
  }

  async getPublicKey(jwtToken: string) {
    try {
      const tokenHeader = JSON.parse(
        Buffer.from(jwtToken.split('.')[0], 'base64').toString(),
      );
      const kid = tokenHeader.kid; // Get the key ID from the token header

      let publicKey = this.publicKeyCache[kid];

      if (
        !publicKey ||
        this.cacheExpiration === null ||
        this.cacheExpiration <= new Date()
      ) {
        await this.refreshPublicKeyCache();
        publicKey = this.publicKeyCache[kid];
        return publicKey;
      }

      return publicKey;
    } catch (error) {
      console.error('Error getting public key:', error);
      return null;
    }
  }

  private async refreshPublicKeyCache() {
    try {
      const response = await fetch(
        `${this.configService.get<string>('KEYCLOAK_REALM_URL')}/protocol/openid-connect/certs`,
        {
          agent: new https.Agent({ rejectUnauthorized: false }), // Use with caution in production.  Ideally, configure your system to trust the Keycloak certificate.
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch JWK: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.keys || !Array.isArray(data.keys)) {
        throw new Error(
          'Invalid JWK response: Missing or invalid "keys" property',
        );
      }

      this.publicKeyCache = {}; // Clear existing cache
      for (const jwk of data.keys) {
        const pem = jwkToPem(jwk);
        this.publicKeyCache[jwk.kid] = pem;
      }
      this.cacheExpiration = new Date(Date.now() + this.cacheDuration);
    } catch (error) {
      console.error('Error fetching/parsing JWK:', error);
      throw error; // Re-throw to be handled by the strategy
    }
  }

  async validate(payload: any): Promise<{ id: string; username: string }> {
    console.log(payload);
    return { id: payload.sub, username: payload.preferred_username };
  }
}
