import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { Express } from 'express';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  findAll(@Query('search') searchString: string) {
    console.log(searchString);
    if (searchString) {
      return this.materialsService.search(searchString);
    }
    return this.materialsService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') materialId: string) {
    return this.materialsService.findOneWithPreview(materialId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findByUser(@Param('id') userId: string, @Query('search') searchString: string) {
    return this.materialsService.findByUser(userId, searchString);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const materialDto = { file, ...body };
    return this.materialsService.create(materialDto);
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
