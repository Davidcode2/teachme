import { Controller, Request, Get, Post, UseGuards, Res, ForbiddenException } from '@nestjs/common';
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

  @Get('health')
  getHealth(): string {
    return "healthy";
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const login = await this.authService.login(req.body.email, req.body.password);
    response.cookie('refresh_token', login.tokens.refreshToken, { secure: true, httpOnly: true })
    response.cookie('userId', login.user.id, { secure: true, httpOnly: true })
    return login;
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/logout')
  async logout(@Res({ passthrough: true }) response: Response, @Request() req) {
    const userId = req.cookies.userId;
    await this.authService.logout(userId);
    response.clearCookie('refresh_token');
    response.clearCookie('userId');
    return true;
  }

  @Get('auth/refresh')
  async refresh(@Request() req, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies.refresh_token;
    const userId = req.cookies.userId;
    if (!userId || !refreshToken) throw new ForbiddenException('Access Denied');
    const { user, tokens } = await this.authService.refreshTokens(userId, refreshToken);
    response.cookie('refresh_token', tokens.refreshToken, { secure: true, httpOnly: true })
    return {user, tokens};
  }

  @Post('auth/signup')
  async signup(@Request() req) {
    return this.authService.signUp(req.body.email, req.body.password);
  }

}
