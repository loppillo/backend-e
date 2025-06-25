import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';


@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private readonly configuracionRepository: Repository<Configuracion>,
  ) {}
  async findAll(): Promise<Configuracion[]> {
    return this.configuracionRepository.find();
  }
  async findOne(id: number): Promise<Configuracion> {
    const configuracion = await this.configuracionRepository.findOneBy({ id });
    if (!configuracion) {
      throw new NotFoundException(`Configuracion with id ${id} not found`);
    }
    return configuracion;
  }
  async create(createConfiguracionDto: CreateConfiguracionDto): Promise<Configuracion> {
    const configuracion = this.configuracionRepository.create(createConfiguracionDto);
    return this.configuracionRepository.save(configuracion);
  }
  async update(id: number, updateConfiguracionDto: UpdateConfiguracionDto): Promise<Configuracion> {
    const configuracion = await this.findOne(id);
    Object.assign(configuracion, updateConfiguracionDto);
    return this.configuracionRepository.save(configuracion);
  }
  async remove(id: number): Promise<void> {
    const result = await this.configuracionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Configuracion with id ${id} not found`);
    }
  }

  async reducirValor(clave: string): Promise<Configuracion> {
  const config = await this.configuracionRepository.findOne({ where: { clave } });

  if (!config) {
    throw new NotFoundException(`⚠️ Configuración con clave "${clave}" no encontrada`);
  }

 
  return this.configuracionRepository.save(config);
}

async getPorAsignatura(asignaturaId: number): Promise<Record<string, string>> {
  const configuraciones = await this.configuracionRepository.findBy({ asignaturaId });
  const resultado: Record<string, string> = {};
  for (const config of configuraciones) {
    resultado[config.clave] = config.valor;
  }
  return resultado;
}


}

