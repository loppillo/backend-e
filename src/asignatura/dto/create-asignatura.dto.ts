import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAsignaturaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  fecha_1?: string;

  @IsOptional()
  @IsString()
  fecha_2?: string;

  @IsOptional()
  @IsInt()
  cantidad_instancia?: number;
}