import { Injectable } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';



@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
  ) {}

  findAll(): Promise<Asistencia[]> {
    return this.asistenciaRepository.find({ relations: ['usuarios'] });
  }

  findOne(id: number): Promise<Asistencia> {
    return this.asistenciaRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });
  }

  create(data: Partial<Asistencia>): Promise<Asistencia> {
    const asistencia = this.asistenciaRepository.create(data);
    return this.asistenciaRepository.save(asistencia);
  }

  async update(id: number, data: Partial<Asistencia>): Promise<Asistencia> {
    await this.asistenciaRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.asistenciaRepository.delete(id);
  }


}


