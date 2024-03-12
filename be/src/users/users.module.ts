import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './usersService/users.service';
import { User } from './user.entity';
import { UsersController } from './usersController/users.controller';
import { ConsumerService } from './consumer/consumer.service';
import { Consumer } from './consumer.entity';
import { AuthorService } from './author/author.service';
import { Author } from './author.entity';
import { MaterialsService } from 'src/materials/materials.service';
import { MaterialsModule } from 'src/materials/materials.module';
import { ConsumerController } from './consumer/consumer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Consumer, Author]), MaterialsModule],
  providers: [UsersService, ConsumerService, AuthorService, MaterialsService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController, ConsumerController],
})
export class UsersModule {}
