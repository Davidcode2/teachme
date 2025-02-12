import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import MaterialOutDto from 'src/shared/DTOs/materialOutDto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addItem(
    @Body() requestBody: { materialId: string },
    @Req() req: Request,
  ) {
    return await this.cartService.addItem(
      req.user['id'],
      requestBody.materialId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getForUser(@Req() req: Request): Promise<MaterialOutDto[]> {
    const user = req.user;
    const materials = this.cartService.getItems(user['id']);
    return materials;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':materialId')
  async removeItem(
    @Req() req: Request,
    @Param('materialId') materialId: string,
  ) {
    const user = req.user;
    return this.cartService.removeItem(user['id'], materialId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  @Header('mode', 'no-cors')
  async buyMaterial(
    @Body() requestBody: { materialId: string[] },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['id'];
    const session = await this.cartService.buyMaterial(
      requestBody.materialId,
      userId,
    );
    res.json({ url: session.url });
  }
}
