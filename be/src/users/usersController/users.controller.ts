import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from '../usersService/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { UpdateUserDto } from 'src/shared/DTOs/updatedUserDto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('avatar/:id')
  async avatar(@Param('id') userId: string, @Res() response: Response) {
    const avatarPath = await this.usersService.getAvatarPath(userId);
    response.setHeader('content-type', 'image/png');
    response.sendFile(avatarPath, { root: './' });
  }

  @Get('author/:id')
  async getUserByAuthorId(@Param('id') authorId: string) {
    const user = await this.usersService.findOneByAuthorId(authorId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') userId: string, @Body() body: UpdateUserDto) {
    const updatedUser = await this.usersService.partialUpdate(userId, body);
    return updatedUser;
  }
}
