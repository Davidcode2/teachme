import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './usersService/users.service';
import { User } from './user.entity';
import { UsersController } from './usersController/users.controller';
import { ConsumerService } from './consumer/consumer.service';
import { Consumer } from './consumer.entity';
import { AuthorService } from './author/author.service';
import { Author } from './author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Consumer, Author])],
  providers: [UsersService, ConsumerService, AuthorService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
