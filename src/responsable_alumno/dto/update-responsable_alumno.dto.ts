import { PartialType } from '@nestjs/mapped-types';
import { CreateResponsableAlumnoDto } from './create-responsable_alumno.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateResponsableAlumnoDto  {
    @IsOptional()
  @IsNumber()
  responsable1Id?: number;

  @IsOptional()
  @IsNumber()
  responsable2Id?: number;
}
