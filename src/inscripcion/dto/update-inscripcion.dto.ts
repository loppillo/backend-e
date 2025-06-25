import { PartialType } from '@nestjs/mapped-types';
import { CreateInscripcionDto } from './create-inscripcion.dto';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInscripcionDto  {
 @IsOptional()
  @IsInt()
  asignaturaId?: number;

}
