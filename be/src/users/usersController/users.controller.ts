import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  Patch,
  Body,
  Req,
} from '@nestjs/common';
import { UsersService } from '../usersService/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { UpdateUserDto } from 'src/shared/DTOs/updatedUserDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/avatar')
  async avatar(@Param('id') userId: string, @Res() response: Response) {
    const avatarPath = await this.usersService.getAvatarPath(userId);
    response.setHeader('content-type', 'image/png');
    response.sendFile(avatarPath, { root: './' });
  }

  @Get('author/:id')
  async getUserByAuthorId(@Param('id') authorId: string) {
    const user = await this.usersService.findOneByAuthorId(authorId);
    const userOutDto = { id: user.id, displayName: user.displayName };
    return userOutDto;
  }

  @UseGuards(JwtAuthGuard)
  @Get('authorId')
  async getAuthorId(@Req() req: Request) {
    const userId = req.user['id'];
    const authorId = await this.usersService.getAuthorId(userId);
    return { data: authorId };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Req() req: Request) {
    const userId = req.user['id'];
    return this.usersService.getStatistics(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Req() req: Request, @Body() body: UpdateUserDto) {
    const userId = req.user['id'];
    const updatedUser = await this.usersService.partialUpdate(userId, body);
    return updatedUser.displayName;
  }
}
