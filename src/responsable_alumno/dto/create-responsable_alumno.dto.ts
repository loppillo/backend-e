import { IsNumber, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class CreateResponsableAlumnoDto {
    @IsNumber()
  @IsNotEmpty()
  alumnoId: number;

  @IsNumber()
  @IsNotEmpty()
  responsableId: number;

 @IsOptional()
  tipo: 'responsable1' | 'responsable2';
}
