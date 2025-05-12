import { PartialType } from '@nestjs/mapped-types';
import { CreateResponsableAlumnoDto } from './create-responsable_alumno.dto';

export class UpdateResponsableAlumnoDto extends PartialType(CreateResponsableAlumnoDto) {}
