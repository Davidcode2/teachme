import { Controller, Request, Get, Post, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const login = await this.authService.login(req.body.email, req.body.password);
    response.cookie('refresh_token', login.tokens.refreshToken, { secure: true, httpOnly: true, sameSite: 'none' })
    response.cookie('userId', login.user.id, { secure: true, httpOnly: true, sameSite: 'none' })
    return login;
  }

  @Get('auth/refresh')
  async refresh(@Request() req, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies.refresh_token;
    const userId = req.cookies.userId;
    const { user, tokens } = await this.authService.refreshTokens(userId, refreshToken);
    response.cookie('refresh_token', tokens.refreshToken, { secure: true, httpOnly: true, sameSite: 'none' })
    return {user, tokens};
  }

  @Post('auth/signup')
  async signup(@Request() req) {
    return this.authService.signUp(req.body.email, req.body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
