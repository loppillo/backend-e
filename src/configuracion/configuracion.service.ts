import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private readonly configuracionRepository: Repository<Configuracion>,
  ) {}

  findAll(): Promise<Configuracion[]> {
    return this.configuracionRepository.find({ relations: ['usuarios'] });
  }

  findOne(id: number): Promise<Configuracion> {
    return this.configuracionRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });
  }

  create(data: Partial<Configuracion>): Promise<Configuracion> {
    const config = this.configuracionRepository.create(data);
    return this.configuracionRepository.save(config);
  }

  async update(id: number, data: Partial<Configuracion>): Promise<Configuracion> {
    await this.configuracionRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.configuracionRepository.delete(id);
  }
}

