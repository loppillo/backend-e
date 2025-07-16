import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCursoDto {
  @IsString()  
  nombre: string;
  @IsOptional()
  tallerIds: number[];
}
