import { IsOptional, IsString } from "class-validator";

export class CreateTallerDto {
  @IsString()  
  nombre: string;
  @IsOptional()
  asignaturaId: number;
  @IsOptional()
  cuposTotales?: number;
  @IsOptional()
  cuposRestantes?: number;

}
