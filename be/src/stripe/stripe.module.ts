import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [StripeService, ConfigService, StripeService],
  imports: [ConfigModule, UsersModule],
  controllers: [StripeController],
  exports: [StripeService]
})
export class StripeModule {}
