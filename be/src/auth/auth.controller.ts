import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Res,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const login = await this.authService.login(
      req.body.userId,
      req.body.preferredUsername,
    );
    return login;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response, @Request() req) {
    const userId = req.cookies.userId;
    await this.authService.logout(userId);
    response.clearCookie('refresh_token');
    response.clearCookie('userId');
    return true;
  }

  @Post('signup')
  async signup(@Request() req, @Res({ passthrough: true }) response: Response) {
    try {
      const signUp = await this.authService.register(
        req.body.email,
        req.body.password,
      );
      if (!signUp) return false;
      const login = await this.authService.login(
        req.body.email,
        req.body.password,
      );
      this.setCookies(login, response);
      return login;
    } catch (e) {
      Logger.error(e.message);
      throw new HttpException(e.message, HttpStatus.NOT_MODIFIED);
    }
  }

  @Post('recaptcha/verify')
  async verifyRecaptcha(@Request() req) {
    const res = await this.authService.verifyRecaptcha(req.body.value);
    return res;
  }

  setCookies(login: any, response: Response) {
    response.cookie('refresh_token', login.tokens.refreshToken, {
      secure: true,
      httpOnly: true,
    });
    response.cookie('userId', login.user.id, { secure: true, httpOnly: true });
  }
}
