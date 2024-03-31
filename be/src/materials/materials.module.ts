import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './materials.controller';
import { Material } from './materials.entity';
import { MaterialsService } from './materials.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from 'src/stripe/stripe.module';
import { MaterialPriceIdFinderModule } from 'src/material-price-id-finder/material-price-id-finder.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material]), ConfigModule, StripeModule, MaterialPriceIdFinderModule],
  exports: [TypeOrmModule, MaterialsService],
  controllers: [MaterialsController],
  providers: [MaterialsService, ConfigService],
})
export class MaterialsModule {}
