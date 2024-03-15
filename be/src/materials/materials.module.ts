import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './materials.controller';
import { Material } from './materials.entity';
import { MaterialsService } from './materials.service';
import { StripeService } from 'src/stripe/stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material]), ConfigModule, StripeModule],
  exports: [TypeOrmModule],
  controllers: [MaterialsController],
  providers: [MaterialsService, StripeService, ConfigService],
})
export class MaterialsModule {}
