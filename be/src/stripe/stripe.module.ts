import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { UsersModule } from 'src/users/users.module';
import { MaterialPriceIdFinderModule } from 'src/material-price-id-finder/material-price-id-finder.module';

@Module({
  providers: [StripeService, ConfigService, StripeService],
  imports: [ConfigModule, UsersModule, MaterialPriceIdFinderModule],
  controllers: [StripeController],
  exports: [StripeService]
})
export class StripeModule {}
