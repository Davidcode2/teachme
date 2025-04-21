import { PartialType } from '@nestjs/mapped-types';
import { Material } from '../../materials/materials.entity';

export class UpdateMaterialDto extends PartialType(Material) {}
