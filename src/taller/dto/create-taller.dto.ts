import { IsString } from "class-validator";

export class CreateTallerDto {
  @IsString()  
  nombre: string;
}
