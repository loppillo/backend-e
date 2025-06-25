import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Injectable()
export class AsignaturaService {
  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturaRepo: Repository<Asignatura>,
  ) {}

  async create(dto: CreateAsignaturaDto): Promise<Asignatura> {
    const asignatura = this.asignaturaRepo.create(dto);
    return this.asignaturaRepo.save(asignatura);
  }

  findAll(): Promise<Asignatura[]> {
    return this.asignaturaRepo.find({
      relations: [ 'inscripciones'],
    });
  }

  async findOne(id: number): Promise<Asignatura> {
    const asignatura = await this.asignaturaRepo.findOne({
      where: { id },
      relations: [ 'inscripciones'],
    });
    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
    }
    return asignatura;
  }

  async update(id: number, dto: UpdateAsignaturaDto): Promise<Asignatura> {
    const asignatura = await this.findOne(id);
    Object.assign(asignatura, dto);
    return this.asignaturaRepo.save(asignatura);
  }

  async remove(id: number): Promise<void> {
    const asignatura = await this.findOne(id);
    await this.asignaturaRepo.remove(asignatura);
  }

   async findByIds(ids: number[]): Promise<Asignatura[]> {
    return this.asignaturaRepo.findBy({ id: In(ids) });
  }
}
