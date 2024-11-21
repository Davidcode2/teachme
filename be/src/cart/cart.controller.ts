import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { Material } from '../materials/materials.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import MaterialWithThumbnail from 'src/shared/Models/MaterialsWithThumbnails';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  async addItem(@Body() requestBody: { userId: string; materialId: string }) {
    return await this.cartService.addItem(
      requestBody.userId,
      requestBody.materialId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getForUser(
    @Query('id') userId: string,
    @Req() req: Request,
  ): Promise<MaterialWithThumbnail[]> {
    const id = req.cookies.userId;
    const materials = this.cartService.getItems(id);
    return materials;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':materialId')
  async removeItem(
    @Body() requestBody: { userId: string },
    @Param('materialId') materialId: string,
  ) {
    return this.cartService.removeItem(requestBody.userId, materialId);
  }

  @Post('buy')
  @Header('mode', 'no-cors')
  async buyMaterial(
    @Body() requestBody: { materialId: string[] },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.cookies.userId;
    const session = await this.cartService.buyMaterial(
      requestBody.materialId,
      userId,
    );
    res.json({ url: session.url });
  }
}
