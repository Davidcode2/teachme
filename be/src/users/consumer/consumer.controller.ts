import { Body, Controller, Header, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConsumerService } from './consumer.service';

@Controller('consumer')
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @Post('addToCart') 
  async addToCart(@Body() requestBody: {consumerId: string, materialId: string})
  {
    await this.consumerService.addToCart(requestBody.materialId, requestBody.consumerId);
  }

  @Post('buy') 
  @Header('mode', 'no-cors')
  async buyMaterial(@Body() requestBody: {consumerId: string, materialId: string}, @Res() res: Response)
  {
    const session = await this.consumerService.buyMaterial(requestBody.materialId, requestBody.consumerId);
    res.json({url: session.url});
  }
}
