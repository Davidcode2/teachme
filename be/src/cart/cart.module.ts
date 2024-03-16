import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
