import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { TipoUsuario } from 'src/tipo_usuario/entities/tipo_usuario.entity';

export class LoginDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  tipoUsuario?: TipoUsuario; // Propiedad opcional
}