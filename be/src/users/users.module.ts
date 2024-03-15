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
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeService } from 'src/stripe/stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Consumer, Author]), MaterialsModule, StripeModule, ConfigModule],
  providers: [UsersService, ConsumerService, AuthorService, ConfigService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController, ConsumerController],
})
export class UsersModule {}
