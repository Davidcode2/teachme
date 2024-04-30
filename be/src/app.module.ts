import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { MaterialsModule } from './materials/materials.module';
import { Material } from './materials/materials.entity';
import { AuthModule } from './auth/auth.module';
import { Consumer } from './consumer/consumer.entity';
import { Author } from './users/author.entity';
import { StripeModule } from './stripe/stripe.module';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/cart.entity';
import { ConsumerModule } from './consumer/consumer.module';
import { MaterialPriceIdFinderModule } from './material-price-id-finder/material-price-id-finder.module';
import { CommonCartModule } from './common-cart/common-cart.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Material, Author, Consumer, Cart],
        synchronize: true,
      }),
    }),
    UsersModule,
    MaterialsModule,
    ConfigModule.forRoot(),
    AuthModule,
    StripeModule,
    CartModule,
    ConsumerModule,
    MaterialPriceIdFinderModule,
    CommonCartModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, CartService],
})
export class AppModule {
  constructor(
    private configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}
}
