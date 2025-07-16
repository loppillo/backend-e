import { IsNumber, IsNotEmpty, IsEnum } from "class-validator";

export class CreateResponsableAlumnoDto {
    @IsNumber()
  @IsNotEmpty()
  alumnoId: number;

  @IsNumber()
  @IsNotEmpty()
  responsableId: number;

  @IsEnum(['responsable1', 'responsable2'])
  tipo: 'responsable1' | 'responsable2';
}
