import { PartialType } from '@nestjs/mapped-types';
import { CreateInscripcionDto } from './create-inscripcion.dto';
import { IsBoolean, IsDate, IsDateString, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInscripcionDto {
   @IsOptional()
   @IsInt({ message: 'El campo "tallerId" debe ser un número entero' })
   tallerId?: number;

  @IsOptional()
  @IsInt({ message: 'El campo "usuarioId" debe ser un número entero' })
  usuarioId?: number;

  @IsOptional()
  @IsInt({ message: 'El campo "asignaturaId" debe ser un número entero' })
  asignaturaId?: number;

  @IsOptional()
  @Type(() => Date) // <-- convierte automáticamente de string a Date
  @IsDate({ message: 'fecha must be a Date instance' })
  fecha?: Date;

  @IsOptional()
  @IsBoolean({ message: 'El campo "inscrito" debe ser booleano' })
  inscrito?: boolean;

  @IsOptional()
  @IsInt({ message: 'El campo "cantidad_limite" debe ser un número entero' })
  cantidad_limite?: number;
}
