import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { UsersService } from './users/usersService/users.service';
import { MaterialsModule } from './materials/materials.module';
import { Material } from './materials/materials.entity';
import { AuthModule } from './auth/auth.module';
import { Consumer } from './users/consumer.entity';
import { Author } from './users/author.entity';
import { StripeModule } from './stripe/stripe.module';

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
        entities: [User, Material, Author, Consumer],
        synchronize: true,
      }),
    }),
    UsersModule,
    MaterialsModule,
    ConfigModule.forRoot(),
    AuthModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}
}
