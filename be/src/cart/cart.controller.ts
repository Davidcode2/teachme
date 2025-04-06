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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import MaterialOutDto from 'src/shared/DTOs/materialOutDto';
import { MaterialItemDto } from './cartDTOs/MaterialItemDto';
import { MaterialItemsDto } from './cartDTOs/materialItemsDto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async addItem(@Body() body: MaterialItemDto, @Req() req: Request) {
    return await this.cartService.addItem(req.user['id'], body.materialId);
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
  @UsePipes(new ValidationPipe())
  async removeItem(@Req() req: Request, @Param() params: MaterialItemDto) {
    const user = req.user;
    return this.cartService.removeItem(user['id'], params.materialId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  @Header('mode', 'no-cors')
  @UsePipes(new ValidationPipe())
  async buyMaterial(
    @Body() requestBody: MaterialItemsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['id'];
    const session = await this.cartService.buyMaterial(
      requestBody.materialIds,
      userId,
    );
    res.json({ url: session.url });
  }
}
