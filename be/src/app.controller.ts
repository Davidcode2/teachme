import { Controller, Get, Post, UseGuards, Res, Req } from '@nestjs/common';
import {Response, Request} from 'express';
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
  async login(@Req() req: Request) {
    console.log(req.session);
    const login = await this.authService.login(req.body.email, req.body.password);
    console.log(req.sessionID);
    return login;
  }

  @Post('auth/signup')
  async signup(@Req() req) {
    return this.authService.signUp(req.body.email, req.body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

}
