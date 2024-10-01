import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async GetById(@Param('id') authorId: string) {
    const author = await this.authorService.findOneById(authorId);
    return author;
  }
}
