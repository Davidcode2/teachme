import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumer } from './consumer.entity';
import { Cart } from 'src/cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consumer, Cart])],
  providers: [ConsumerService],
  exports: [ConsumerService]
})
export class ConsumerModule {}

