import { Injectable } from '@nestjs/common';
import { CreateResponsableAlumnoDto } from './dto/create-responsable_alumno.dto';
import { UpdateResponsableAlumnoDto } from './dto/update-responsable_alumno.dto';

@Injectable()
export class ResponsableAlumnoService {
  create(createResponsableAlumnoDto: CreateResponsableAlumnoDto) {
    return 'This action adds a new responsableAlumno';
  }

  findAll() {
    return `This action returns all responsableAlumno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} responsableAlumno`;
  }

  update(id: number, updateResponsableAlumnoDto: UpdateResponsableAlumnoDto) {
    return `This action updates a #${id} responsableAlumno`;
  }

  remove(id: number) {
    return `This action removes a #${id} responsableAlumno`;
  }
}
