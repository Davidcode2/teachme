import { Body, Controller, Post } from '@nestjs/common';
import { ConsumerService } from './consumer.service';

@Controller('consumer')
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @Post('buy') 
  async buyMaterial(@Body() requestBody: {consumerId: string, materialId: string})
  {
    console.log(requestBody);
    this.consumerService.addMaterial(requestBody.materialId, requestBody.consumerId);
  }
}
