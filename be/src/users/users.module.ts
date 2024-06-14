import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './usersService/users.service';
import { User } from './user.entity';
import { UsersController } from './usersController/users.controller';
import { Consumer } from '../consumer/consumer.entity';
import { AuthorService } from './author/author.service';
import { Author } from './author.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cart } from '../cart/cart.entity';
import { ConsumerModule } from '../consumer/consumer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Consumer, Author, Cart]),
    ConfigModule,
    ConsumerModule,
  ],
  providers: [UsersService, AuthorService, ConfigService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
