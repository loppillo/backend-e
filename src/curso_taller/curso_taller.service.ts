import { Injectable } from '@nestjs/common';
import { CreateCursoTallerDto } from './dto/create-curso_taller.dto';
import { UpdateCursoTallerDto } from './dto/update-curso_taller.dto';

@Injectable()
export class CursoTallerService {
  create(createCursoTallerDto: CreateCursoTallerDto) {
    return 'This action adds a new cursoTaller';
  }

  findAll() {
    return `This action returns all cursoTaller`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cursoTaller`;
  }

  update(id: number, updateCursoTallerDto: UpdateCursoTallerDto) {
    return `This action updates a #${id} cursoTaller`;
  }

  remove(id: number) {
    return `This action removes a #${id} cursoTaller`;
  }
}
