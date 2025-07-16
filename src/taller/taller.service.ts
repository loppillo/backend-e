import { Injectable } from '@nestjs/common';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Taller } from './entities/taller.entity';

@Injectable()
export class TallerService {
  constructor(
    @InjectRepository(Taller)
    private tallerRepo: Repository<Taller>,
  ) {}

  async create(nombre: string): Promise<Taller> {
    const taller = this.tallerRepo.create({ nombre });
    return this.tallerRepo.save(taller);
  }

  async findAll(): Promise<Taller[]> {
    return this.tallerRepo.find({ relations: ['cursos'] });
  }

  async findById(id: number): Promise<Taller> {
    return this.tallerRepo.findOne({
      where: { id },
      relations: ['cursos']
    });
  }
}

