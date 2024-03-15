import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService, ConfigService],
  imports: [ConfigModule],
  controllers: [StripeController],
  exports: [StripeService]
})
export class StripeModule {}
