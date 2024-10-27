import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { Express } from 'express';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  findAll(
    @Query('search') searchString: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    if (searchString) {
      return this.materialsService.search(searchString);
    }
    Logger.debug(`offset: ${offset}`);
    const offsetNum = Number(offset);
    const limitNum = Number(limit);
    return this.materialsService.findAll(10, offsetNum, limitNum);
  }

  @Get('id/:id')
  findOne(@Param('id') materialId: string) {
    return this.materialsService.findOneWithPreview(materialId);
  }

  @Get('by/:userId')
  findByAuthor(@Param('userId') userId: string) {
    return this.materialsService.findByCreator(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findByUser(
    @Param('id') userId: string,
    @Query('search') searchString: string,
  ) {
    return this.materialsService.findByUser(userId, searchString);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const materialDto = { file, ...body };
    return this.materialsService.create(materialDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') materialId: string) {
    return this.materialsService.delete(materialId);
  }

  @Get('download')
  async download(@Query('id') materialId: string, @Res() response: Response) {
    // check if material is owned by user
    // if not throw unauthorized exception
    response.setHeader('content-type', 'application/pdf');
    const file = await this.materialsService.getFile(materialId);
    response.send(file);
  }
}
