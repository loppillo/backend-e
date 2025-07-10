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

async getConfiguracionDefecto(): Promise<Record<string, string>> {
    try {
      const configuraciones = await this.configuracionRepository.find({
        where: { asignatura: null }, // Configuraciones globales
        select: ['clave', 'valor']
      });

      const configObj: Record<string, string> = {};
      configuraciones.forEach(config => {
        configObj[config.clave] = config.valor.toString();
      });

      // Si no hay configuraciones, devolver valores por defecto
      if (Object.keys(configObj).length === 0) {
        return {
          'semana_visible': '2',
          'max_inscripciones_semana': '2',
          'cupos': '20',
          'inscripciones_por_dia': '5',
          'dias_habiles': '3,4'
        };
      }

      return configObj;
    } catch (error) {
      console.error('Error al obtener configuración por defecto:', error);
      throw error;
    }
  }

  // Verificar si existe configuración específica para una asignatura
  async existeConfiguracionPorAsignatura(asignaturaId: number): Promise<boolean> {
    try {
      const count = await this.configuracionRepository.count({
        where: { asignatura: { id: asignaturaId } }
      });
      return count > 0;
    } catch (error) {
      console.error(`Error al verificar configuración para asignatura ${asignaturaId}:`, error);
      return false;
    }
  }

  // Obtener configuraciones específicas por asignatura
  async getConfiguracionesPorAsignatura(asignaturaId: number): Promise<Record<string, string>> {
    try {
      const configuraciones = await this.configuracionRepository.find({
        where: { asignatura: { id: asignaturaId } },
        select: ['clave', 'valor']
      });

      if (configuraciones.length === 0) {
        throw new NotFoundException(`No se encontraron configuraciones para la asignatura ${asignaturaId}`);
      }

      const configObj: Record<string, string> = {};
      configuraciones.forEach(config => {
        configObj[config.clave] = config.valor.toString();
      });

      return configObj;
    } catch (error) {
      console.error(`Error al obtener configuraciones para asignatura ${asignaturaId}:`, error);
      throw error;
    }
  }

  // Método auxiliar para obtener configuración con fallback automático
  async getConfiguracionConFallback(asignaturaId?: number): Promise<Record<string, string>> {
    try {
      if (asignaturaId) {
        const existe = await this.existeConfiguracionPorAsignatura(asignaturaId);
        if (existe) {
          return await this.getConfiguracionesPorAsignatura(asignaturaId);
        }
      }
      
      // Fallback a configuración por defecto
      return await this.getConfiguracionDefecto();
    } catch (error) {
      console.error('Error al obtener configuración con fallback:', error);
      // Último fallback - valores hardcodeados
      return {
        'semana_visible': '2',
        'max_inscripciones_semana': '2',
        'cupos': '20',
        'inscripciones_por_dia': '5',
        'dias_habiles': '3,4'
      };
    }
  }


}

