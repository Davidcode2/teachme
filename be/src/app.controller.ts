import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('healthcheck')
  getHealth(): any {
    return { status: 'healthy' };
  }
}
