import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './materials.controller';
import { Material } from './materials.entity';
import { MaterialsService } from './materials.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from '../stripe/stripe.module';
import { MaterialPriceIdFinderModule } from '../material-price-id-finder/material-price-id-finder.module';
import { UsersModule } from '../users/users.module';
import { ImageService } from './image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material]),
    ConfigModule,
    StripeModule,
    MaterialPriceIdFinderModule,
    UsersModule,
    ImageService,
  ],
  exports: [TypeOrmModule, MaterialsService],
  controllers: [MaterialsController],
  providers: [MaterialsService, ConfigService, ImageService],
})
export class MaterialsModule {}
