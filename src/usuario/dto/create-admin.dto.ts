import { IsOptional, IsNumber } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';
export class CreateAdminDto extends CreateUsuarioDto {
  @IsOptional()
  @IsNumber()
  configuracion_id?: number; // si el admin tiene alguna config especial
}