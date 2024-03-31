import { Module } from '@nestjs/common';
import { FinderByPriceIdService } from './material-price-id-finder.service';
import { Material } from 'src/materials/materials.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  providers: [FinderByPriceIdService],
  exports: [FinderByPriceIdService],
})
export class MaterialPriceIdFinderModule {}
