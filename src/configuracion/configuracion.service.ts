import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';
import { DateTime } from 'luxon';

@Injectable()
export class ConfiguracionService {
  private lastFetchTime: number = 0;
private cacheDurationMs = 5 * 60 * 1000; // 5 minutos
private configCache: Map<string, number> = new Map();
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



async getConfiguracionDefecto(): Promise<Record<string, string>> {
    try {
      const configuraciones = await this.configuracionRepository.find({
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
 


  


  async findByClave(clave: string): Promise<Configuracion | null> {
    return this.configuracionRepository.findOne({ where: { clave } });
  }

 

  async getAll(): Promise<Configuracion[]> {
    return this.configuracionRepository.find();
  }

    async updates(clave: string, valor: string): Promise<Configuracion> {
    let config = await this.findByClave(clave);
    if (!config) {
      config = this.configuracionRepository.create({ clave, valor });
    } else {
      config.valor = valor;
    }
    return this.configuracionRepository.save(config);
  }


 async esPeriodoInscripcionActivo(): Promise<boolean> {
  const apertura = await this.findByClave('inscripcion_apertura');
  const cierre = await this.findByClave('inscripcion_cierre');

  if (!apertura || !cierre) return false;

  const ahora = DateTime.now().setZone('America/Santiago');
  const aperturaDT = DateTime.fromISO(apertura.valor, { zone: 'America/Santiago' });
  const cierreDT = DateTime.fromISO(cierre.valor, { zone: 'America/Santiago' });

  return ahora >= aperturaDT && ahora <= cierreDT;
}

  async obtenerValor(clave: string): Promise<string> {
    const config = await this.configuracionRepository.findOneBy({ clave });
    if (!config) throw new NotFoundException(`Configuración ${clave} no encontrada`);
    return config.valor;
  }



  async actualizarValor(clave: string, nuevoValor: string): Promise<void> {
    const config = await this.configuracionRepository.findOneBy({ clave });
    if (!config) {
      await this.configuracionRepository.save({ clave, valor: nuevoValor, descripcion: '' });
    } else {
      config.valor = nuevoValor;
      await this.configuracionRepository.save(config);
    }
  }

  async incrementar(clave: string): Promise<void> {
    const actual = await this.obtenerNumero(clave);
    await this.actualizarValor(clave, (actual + 1).toString());
  }

  async reiniciar(clave: string): Promise<void> {
    await this.actualizarValor(clave, '1');
  }

 async obtenerNumero(clave: string): Promise<number> {
  const now = Date.now();
  if (this.configCache.has(clave) && now - this.lastFetchTime < this.cacheDurationMs) {
    return this.configCache.get(clave);
  }

  const config = await this.configuracionRepository.findOne({ where: { clave } });
  if (!config) throw new Error(`Configuración no encontrada: ${clave}`);
  const valor = Number(config.valor);
  this.configCache.set(clave, valor);
  this.lastFetchTime = now;
  return valor;
}

  async obtenerTexto(clave: string): Promise<string> {
    const config = await this.configuracionRepository.findOne({ where: { clave } });
    if (!config) throw new Error(`Configuración no encontrada: ${clave}`);
    return config.valor;
  }

   async get(key: string): Promise<string> {
    const config = await this.configuracionRepository.findOne({ where: { clave: key } });
    if (!config) throw new Error(`Config key ${key} not found`);
    return config.valor;
  }

  async getInt(key: string): Promise<number> {
    return parseInt(await this.get(key), 10);
  }
}

