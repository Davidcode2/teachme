import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialItemDto } from './MaterialItemDto';

export class MaterialItemsDto {
  @IsArray()
  @Type(() => MaterialItemDto)
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  materialIds: string[];
}
