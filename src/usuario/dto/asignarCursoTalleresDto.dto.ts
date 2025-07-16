import { IsOptional } from "class-validator";

export class AsignarCursoTalleresDto {
  @IsOptional()  
  cursoId: number;
  @IsOptional()
  tallerIds: number[];
}