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

  @Post()
  async addItem(@Body() requestBody: { userId: string; materialId: string }) {
    return await this.cartService.addItem(
      requestBody.userId,
      requestBody.materialId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getForUser(@Req() req: Request): Promise<MaterialOutDto[]> {
    const user = req.user;
    console.log(user);
    console.log(user['id']);
    const materials = this.cartService.getItems(user['id']);
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
