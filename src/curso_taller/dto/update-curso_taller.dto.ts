import { PartialType } from '@nestjs/mapped-types';
import { CreateCursoTallerDto } from './create-curso_taller.dto';

export class UpdateCursoTallerDto extends PartialType(CreateCursoTallerDto) {}
