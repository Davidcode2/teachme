import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { UsersModule } from '../users/users.module';
import { MaterialsModule } from '../materials/materials.module';
import { StripeModule } from '../stripe/stripe.module';
import { CommonCartModule } from '../common-cart/common-cart.module';
import { CommonCartService } from '../common-cart/common-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    MaterialsModule,
    StripeModule,
    CommonCartModule,
  ],
  providers: [CartService, CommonCartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
