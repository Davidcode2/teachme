import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { UsersModule } from 'src/users/users.module';
import { MaterialsModule } from 'src/materials/materials.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UsersModule, MaterialsModule],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
