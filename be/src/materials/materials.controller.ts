import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { Express } from 'express';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import PaginationObject from 'src/shared/DTOs/paginationObject';
import { ApiTags } from '@nestjs/swagger';
import { UpdateMaterialDto } from 'src/shared/DTOs/updatedMaterialDto';

@ApiTags('materials')
@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  findAll(
    @Query('search') searchString: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 5,
  ) {
    if (searchString) {
      return this.materialsService.search(searchString);
    }
    const pagination = new PaginationObject(10, Number(offset), Number(limit));
    return this.materialsService.findAll(pagination);
  }

  @Get('page')
  findAllPaginated(
    @Query('page') page: number = 0,
    @Query('pageSize') pageSize: number = 5,
  ) {
    return this.materialsService.findAllPaginated(page, pageSize);
  }

  @Get('total')
  async getTotal() {
    return this.materialsService.getTotal();
  }

  @Get(':id/preview')
  findOne(@Param('id') materialId: string) {
    return this.materialsService.findOneWithPreview(materialId);
  }

  @Get(':id/thumbnail')
  findOneThumbnail(@Param('id') materialId: string) {
    return this.materialsService.findOneWithThumbnail(materialId);
  }

  @Get('by-user')
  findByAuthor(@Request() req) {
    const userId = req.cookies.userId;
    return this.materialsService.findByCreator(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('own')
  findByUser(@Request() req, @Query('search') searchString: string) {
    const userId = req.cookies.userId;
    return this.materialsService.findByUser(userId, searchString);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const materialDto = { file, ...body };
    const userId = req.cookies.userId;
    return this.materialsService.create(userId, materialDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') materialId: string,
    @Body() materialDto: UpdateMaterialDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.materialsService.update(materialId, materialDto, file);
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
