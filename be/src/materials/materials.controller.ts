import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { Express } from 'express';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  findAll(@Req() request: Request) {
    return this.materialsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const materialDto = { file, ...body };
    return this.materialsService.create(materialDto);
  }

  @Get('download')
  download(@Query('id') materialId: string) {
    console.log(materialId);
    // check if material is owned by user
    // if not throw unauthorized exception
    return this.materialsService.getFile(materialId);
  }
}
