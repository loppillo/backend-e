import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({ relations: ['asignatura', 'usuarios'] });
  }

  findOne(id: number): Promise<Inscripcion> {
    return this.inscripcionRepository.find({
      where: { id },
      relations: ['asignatura', 'usuarios'],
    }).then(result => result[0]);
  }

  create(data: Partial<Inscripcion>): Promise<Inscripcion> {
    const inscripcion = this.inscripcionRepository.create(data);
    return this.inscripcionRepository.save(inscripcion);
  }

  async update(id: number, data: Partial<Inscripcion>): Promise<Inscripcion> {
    await this.inscripcionRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.inscripcionRepository.delete(id);
  }
}
