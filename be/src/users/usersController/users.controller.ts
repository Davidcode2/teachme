import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../usersService/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
}

