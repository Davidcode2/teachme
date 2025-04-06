import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class RemoveItemParamsDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsUUID('4')
  materialId: string;
}
