import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumer } from './consumer.entity';
import { Cart } from 'src/cart/cart.entity';
import { MaterialsModule } from 'src/materials/materials.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consumer, Cart]), MaterialsModule, StripeModule, CartModule],
  controllers: [ConsumerController],
  providers: [ConsumerService],
  exports: [ConsumerService]
})
export class ConsumerModule {}

