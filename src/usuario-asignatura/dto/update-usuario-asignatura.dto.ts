import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioAsignaturaDto } from './create-usuario-asignatura.dto';

export class UpdateUsuarioAsignaturaDto extends PartialType(CreateUsuarioAsignaturaDto) {}
