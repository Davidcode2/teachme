import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { UsersModule } from 'src/users/users.module';
import { MaterialsModule } from 'src/materials/materials.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { CommonCartModule } from 'src/common-cart/common-cart.module';
import { CommonCartService } from 'src/common-cart/common-cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UsersModule, MaterialsModule, StripeModule, CommonCartModule],
  providers: [CartService, CommonCartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
