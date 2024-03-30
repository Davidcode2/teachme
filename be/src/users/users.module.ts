import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './usersService/users.service';
import { User } from './user.entity';
import { UsersController } from './usersController/users.controller';
import { ConsumerService } from '../consumer/consumer.service';
import { Consumer } from '../consumer/consumer.entity';
import { AuthorService } from './author/author.service';
import { Author } from './author.entity';
import { MaterialsModule } from 'src/materials/materials.module';
import { ConsumerController } from '../consumer/consumer.controller';
import { StripeModule } from 'src/stripe/stripe.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cart } from 'src/cart/cart.entity';
import { CartModule } from 'src/cart/cart.module';
import { ConsumerModule } from 'src/consumer/consumer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Consumer, Author, Cart]), MaterialsModule, StripeModule, ConfigModule, CartModule, ConsumerModule],
  providers: [UsersService, ConsumerService, AuthorService, ConfigService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController, ConsumerController],
})
export class UsersModule {}
