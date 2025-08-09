import {
  IsDateString,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  IsString,
} from 'class-validator';

export class CreateInscripcionDto {
 @IsDateString()
  fecha:string;

  @IsBoolean({ message: 'El campo "inscrito" debe ser booleano' })
  inscrito: boolean;

  @IsInt({ message: 'La cantidad límite debe ser un número entero' })
  @Min(0, { message: 'La cantidad límite no puede ser negativa' })
  cantidad_limite: number;

  @IsOptional()
  usuarioId: number;

  @IsOptional()
  asignaturaId: number;
}
