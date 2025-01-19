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
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { Express } from 'express';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UpdateMaterialDto } from 'src/shared/DTOs/updatedMaterialDto';

@ApiTags('materials')
@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}
  private readonly logger = new Logger(MaterialsController.name, {
    timestamp: true,
  });

  @Get()
  findAllPaginated(@Request() req) {
    const { page, pageSize } = req.query;
    Logger.log(`page: ${page}, pageSize: ${pageSize}`);
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    this.logger.log(
      `returning paginated:\n page: ${pageInt}\n pageSize: ${pageSizeInt}`,
    );
    return this.materialsService.findPaginated(pageInt, pageSizeInt);
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
