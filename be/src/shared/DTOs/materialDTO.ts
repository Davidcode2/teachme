import { Material } from '../../materials/materials.entity';

export interface MaterialDto {
  material: Material;
  thumbnail: Buffer;
}
