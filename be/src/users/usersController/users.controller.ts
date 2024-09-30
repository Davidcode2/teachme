import { Controller, Get, Param, UseGuards, Res } from '@nestjs/common';
import { UsersService } from '../usersService/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('avatar/:id')
  async avatar(@Param('id') userId: string, @Res() response: Response) {
    const avatarPath = await this.usersService.getAvatarPath(userId);
    response.setHeader('content-type', 'image/png');
    response.sendFile(avatarPath, { root: './' });
  }
}
