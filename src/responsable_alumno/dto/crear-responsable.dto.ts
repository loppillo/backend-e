import { IsString, MaxLength, IsEmail, IsOptional, IsEnum } from "class-validator";

export class CrearResponsable{
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsEmail()
  @MaxLength(255)
  correo: string;

 
}
