import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './materials.controller';
import { Material } from './materials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  exports: [TypeOrmModule],
  controllers: [MaterialsController],
})
export class MaterialsModule {}
