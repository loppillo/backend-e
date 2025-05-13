import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { Asignatura } from './entities/asignatura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsignaturaService {
constructor(
    @InjectRepository(Asignatura)
    private asignaturaRepo: Repository<Asignatura>,
  ) {}

  async findAll(): Promise<Asignatura[]> {
    return this.asignaturaRepo.find({ relations: ['inscripcion'] });
  }

  async findOne(id: number): Promise<Asignatura> {
    return this.asignaturaRepo.findOne({ where: { id }, relations: ['inscripcion'] });
  }

  async create(data: Partial<Asignatura>): Promise<Asignatura> {
    const nuevaAsignatura = this.asignaturaRepo.create(data);
    return this.asignaturaRepo.save(nuevaAsignatura);
  }

  async update(id: number, data: Partial<Asignatura>): Promise<Asignatura> {
    await this.asignaturaRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.asignaturaRepo.delete(id);
  }
}
