import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { UsersModule } from 'src/users/users.module';
import { MaterialPriceIdFinderModule } from 'src/material-price-id-finder/material-price-id-finder.module';
import { CommonCartModule } from 'src/common-cart/common-cart.module';
import { CommonCartService } from 'src/common-cart/common-cart.service';

@Module({
  providers: [StripeService, ConfigService, StripeService, CommonCartService],
  imports: [ConfigModule, UsersModule, MaterialPriceIdFinderModule, CommonCartModule],
  controllers: [StripeController],
  exports: [StripeService]
})
export class StripeModule {}
