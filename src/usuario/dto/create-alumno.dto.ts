import { CreateUsuarioDto } from './create-usuario.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAlumnoDto extends CreateUsuarioDto {
  @IsNotEmpty()
  @IsNumber()
  responsable_alumno_id: number; // ID del responsable
}
