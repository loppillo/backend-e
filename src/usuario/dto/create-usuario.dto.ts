import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { Type } from 'class-transformer';

export enum TipoUsuarioEnum {
  ADMIN = 1,
  PROFESOR = 2,
  ALUMNO = 3,
}

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsEnum(TipoUsuarioEnum)
  @Type(() => Number)
  tipo_usuario: TipoUsuarioEnum;
}

