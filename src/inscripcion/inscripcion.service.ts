import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, In, Repository } from 'typeorm';

import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Observable } from 'rxjs';
import { UsuarioAsignatura } from 'src/usuario-asignatura/entities/usuario-asignatura.entity';
import { DateTime } from 'luxon';
import { ConfiguracionService } from 'src/configuracion/configuracion.service';
import { Taller } from 'src/taller/entities/taller.entity';

@Injectable()
export class InscripcionService {
  constructor(
        private readonly dataSource: DataSource,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Taller) private readonly tallerRepo: Repository<Taller>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Asignatura)
    private readonly asignaturaRepo: Repository<Asignatura>,
    @InjectRepository(UsuarioAsignatura)
    private readonly usuarioAsignaturaRepo: Repository<UsuarioAsignatura>,
    private readonly configService: ConfiguracionService,
  ) { }


  async create(dto: CreateInscripcionDto): Promise<{ mensaje: string }> {
    // 1. Buscar usuario y asignatura en paralelo
    const [usuario, asignatura] = await Promise.all([
      this.usuarioRepo.findOne({ where: { id: dto.usuarioId } }),
      this.asignaturaRepo.findOneBy({ id: dto.asignaturaId }),
    ]);

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (!asignatura) throw new NotFoundException('Asignatura no encontrada');

    // 2. Obtener configuraciones en paralelo
    const claveClases = `clases_dictadas_${asignatura.nombre.toLowerCase()}`;
    const [cupoMaxAsignatura, clasesDictadasRaw] = await Promise.all([
      this.configService.obtenerNumero('cupo_maximo_asignatura'),
      this.configService.obtenerNumero(claveClases),
    ]);

    const clasesDictadas = Number(clasesDictadasRaw) || 0;

    // 3. Verificar cupo máximo para la asignatura
    const totalInscritos = await this.inscripcionRepo.count({
      where: {
        asignatura: { id: asignatura.id },
        inscrito: true,
      },
    });

    if (totalInscritos >= cupoMaxAsignatura) {
      throw new BadRequestException(
        `Cupo máximo (${cupoMaxAsignatura}) alcanzado para ${asignatura.nombre}.`
      );
    }

    // 4. Reglas: máximo 2 inscripciones por alumno cada 8 clases
    if (clasesDictadas + 1 > 8) {
      await this.configService.reiniciar(claveClases); // reiniciar a 0
    } else {
      await this.configService.actualizarValor(claveClases, (clasesDictadas + 1).toString());
    }

    // Contar inscripciones recientes válidas para la regla
    const inscripcionesValidas = await this.inscripcionRepo.find({
      where: {
        usuario: { id: dto.usuarioId },
        asignatura: { id: asignatura.id },
      },
      order: { fecha: 'DESC' },
      take: 8,
    });

    if (inscripcionesValidas.filter(i => i.inscrito).length >= 2) {
      throw new BadRequestException(
        `No puedes tomar ${asignatura.nombre} más de 2 veces cada 8 clases.`
      );
    }

    // 5. Crear y guardar inscripción
    const inscripcion = this.inscripcionRepo.create({
      fecha: dto.fecha,
      inscrito: dto.inscrito,
      cantidad_limite: dto.cantidad_limite ?? 0,
      usuario,
      asignatura,
    });

    await this.inscripcionRepo.save(inscripcion);

    return {
      mensaje: `Inscripción a ${asignatura.nombre} registrada correctamente.`,
    };
  }






 async findAll(): Promise<Inscripcion[]> {
  return this.inscripcionRepo.find({
    relations: ['usuario', 'asignatura'],
    select: {
      id: true,
      fecha: true,
      inscrito: true,
      usuario: {
        id: true,
        nombre: true, // Asegúrate de incluir los campos que deseas
      },
      asignatura: {
        id: true,
        nombre: true,
      },
    
    },
  });
}

  async findOne(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id },
      relations: ['usuario', 'asignatura'],
    });
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return inscripcion;
  }



  async remove(id: number): Promise<void> {
    const inscripcion = await this.findOne(id);
    await this.inscripcionRepo.remove(inscripcion);
  }

  async findByFechaAndUsuario(fecha: string, usuarioId: number): Promise<Inscripcion[]> {
    // Primero normalizamos la fecha eliminando cualquier parte de hora
    const fechaNormalizada = fecha.split('T')[0];

    if (!usuarioId || isNaN(usuarioId)) {
      throw new NotFoundException('usuarioId inválido');
    }

    return this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.asignatura', 'asignatura')
      .leftJoinAndSelect('inscripcion.usuario', 'usuario')
      .where('DATE(inscripcion.fecha) = :fecha', { fecha: fechaNormalizada })
      .andWhere('usuario.id = :usuarioId', { usuarioId })
      .getMany();
  }

async updates(id: number, dto: UpdateInscripcionDto): Promise<Inscripcion> {
  const inscripcion = await this.inscripcionRepo.findOne({
    where: { id },
    relations: ['usuario', 'asignatura', 'taller'],
  });
  if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);

  // Actualizar datos si vienen en el DTO
  if (dto.fecha) inscripcion.fecha = new Date(dto.fecha);
  if (dto.inscrito !== undefined) inscripcion.inscrito = dto.inscrito;

  if (dto.usuarioId) {
    const usuario = await this.usuarioRepo.findOneBy({ id: dto.usuarioId });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    inscripcion.usuario = usuario;
  }

  if (dto.asignaturaId) {
    const asignatura = await this.asignaturaRepo.findOneBy({ id: dto.asignaturaId });
    if (!asignatura) throw new NotFoundException('Asignatura no encontrada');
    inscripcion.asignatura = asignatura;
  }

  if (dto.tallerId) {
  const taller = await this.tallerRepo.findOneBy({ id: dto.tallerId });
  if (!taller) {
    throw new NotFoundException('Taller no encontrado');
  }
  inscripcion.taller = taller;
}

  const usuarioId = dto.usuarioId ?? inscripcion.usuario.id;
  const asignaturaId = dto.asignaturaId ?? inscripcion.asignatura.id;
  const fecha = dto.fecha ? new Date(dto.fecha) : inscripcion.fecha;

  // --- Validaciones ---
  const { start: weekStart, end: weekEnd } = this.getWeekRange(fecha);
  const inscripcionesSemana = await this.inscripcionRepo.count({
    where: {
      usuario: { id: usuarioId },
      asignatura: { id: asignaturaId },
      fecha: Between(weekStart, weekEnd),
    },
  });
  if (inscripcionesSemana >= 2) {
    throw new BadRequestException('No puedes tomar la misma asignatura más de 2 veces en una semana');
  }

  const cupoGeneral = await this.inscripcionRepo.count({
    where: { asignatura: { id: asignaturaId }, inscrito: true },
  });
  if (cupoGeneral >= 28) {
    throw new BadRequestException('La asignatura alcanzó el cupo máximo de 28 estudiantes');
  }

  const { start: fourStart, end: fourEnd } = this.getFourWeekRange(fecha);
  const inscripcionesUlt4Semanas = await this.inscripcionRepo.find({
    where: { usuario: { id: usuarioId }, fecha: Between(fourStart, fourEnd), inscrito: true },
    relations: ['asignatura'],
  });
  const ramosUnicos = new Set(inscripcionesUlt4Semanas.map(i => i.asignatura.id));
  ramosUnicos.add(asignaturaId);
  if (ramosUnicos.size > 2) {
    throw new BadRequestException('No puedes inscribirte en más de 2 asignaturas distintas en 4 semanas');
  }

  if (inscripcion.taller) {
    const cupoTaller = await this.inscripcionRepo.count({
      where: { taller: { id: inscripcion.taller.id }, inscrito: true },
    });
    if (cupoTaller >= 7) {
      throw new BadRequestException('Este taller ya alcanzó el cupo máximo de 7 estudiantes');
    }
  }

  // Guardar cambios
  return await this.inscripcionRepo.save(inscripcion);
}



  async estaInscrito(alumnoId: number): Promise<boolean> {
    const existe = await this.inscripcionRepo.findOne({
      where: { usuario: { id: alumnoId } },
    });
    return !!existe;
  }

  async findByIds(ids: number[]): Promise<Asignatura[]> {
    return this.asignaturaRepo.findBy({ id: In(ids) });
  }

  async getInscripcionesPorUsuario(usuarioId: number) {
    return this.inscripcionRepo.find({
      where: { usuario: { id: Number(usuarioId) } },
      relations: [
        'asignatura',
        'asignatura.profesor', // <--- importante
        'usuario',
        'usuario.tipoUsuario'
      ],
    });
  }


  async getInscripcionesPorUsuarioSemana(usuarioId: number, fechaInicio: string, fechaFin: string) {
    const inscripciones = await this.inscripcionRepo.find({
      where: {
        usuario: { id: Number(usuarioId) },
        fecha: Between(new Date(fechaInicio), new Date(fechaFin))
      },
      relations: [
        'asignatura',
        'usuario',
        'usuario.tipoUsuario',
        'usuario.responsable1',
        'usuario.responsable2',
        'usuario.curso',   // taller vinculado al usuario
        'usuario.curso.talleres'    // curso vinculado al usuario
      ]
    });

    for (const inscripcion of inscripciones) {
      const profesoresRelacionados = await this.usuarioAsignaturaRepo.find({
        where: {
          asignatura: { id: inscripcion.asignatura.id }
        },
        relations: ['usuario', 'usuario.tipoUsuario']
      });

      const profesores = profesoresRelacionados
        .filter(rel => rel.usuario.tipoUsuario?.tipo === 'profesor')
        .map(rel => ({
          id: rel.usuario.id,
          nombre: rel.usuario.nombre,
          apellido: rel.usuario.apellido
        }));

      inscripcion.asignatura['profesores'] = profesores;
    }

    return inscripciones;
  }





  async findByUsuarioAndAsignaturas(usuarioId: number, asignaturaIds: number[]) {
    // Filtrar IDs no válidos
    const ids = (asignaturaIds || [])
      .map(id => Number(id))
      .filter(id => Number.isFinite(id) && Number.isInteger(id) && id > 0);
    if (!ids.length) {
      // Log defensivo para depuración
      console.warn('findByUsuarioAndAsignaturas: No hay IDs válidos', { usuarioId, asignaturaIdsOriginal: asignaturaIds });
      return [];
    }
    return this.inscripcionRepo.find({
      where: {
        usuario: { id: usuarioId },
        asignatura: { id: In(ids) },
      },
      relations: ['asignatura', 'usuario'],
    });
  }

  async contarAsignaturasPorUsuario(usuarioId: number): Promise<any[]> {
      return this.inscripcionRepo
    .createQueryBuilder('inscripcion')
    .select('asignatura.nombre', 'nombre')
    .addSelect('COUNT(*)', 'cantidad')
    .innerJoin('inscripcion.asignatura', 'asignatura')
    .innerJoin('inscripcion.usuario', 'usuario')
    .where('usuario.id = :usuarioId', { usuarioId })
    .groupBy('asignatura.nombre')
    .getRawMany();
}

  // inscripcion.service.ts
  async verificarRestriccionesInscripcion(usuarioId: number, asignaturaId: number): Promise<void> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id: usuarioId },
      relations: ['curso'],
    });
    if (!usuario || !usuario.curso) throw new BadRequestException('Usuario no válido o sin curso');

    const maxAsignatura = +(await this.configService.findByClave('cupo_maximo_asignatura'))?.valor || 28;
    const maxPorCurso = +(await this.configService.findByClave('cupo_maximo_por_curso'))?.valor || 7;
    const maxPorAlumno = +(await this.configService.findByClave('maximo_clases_por_asignatura'))?.valor || 2;
    const semanasPeriodo = +(await this.configService.findByClave('periodo_semanal'))?.valor || 4;

    const totalInscritos = await this.inscripcionRepo.count({
      where: { asignatura: { id: asignaturaId } },
    });
    if (totalInscritos >= maxAsignatura) {
      throw new BadRequestException('No quedan cupos disponibles para esta asignatura');
    }

    const inscritosCurso = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .leftJoin('inscripcion.usuario', 'usuario')
      .where('usuario.curso.id = :cursoId', { cursoId: usuario.curso.id })
      .andWhere('inscripcion.asignatura.id = :asignaturaId', { asignaturaId })
      .getCount();
    if (inscritosCurso >= maxPorCurso) {
      throw new BadRequestException('No quedan cupos para este curso en esta asignatura');
    }

    const fechaLimite = DateTime.now().minus({ weeks: semanasPeriodo }).toISODate();
    const clasesTomadas = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .where('inscripcion.usuario.id = :usuarioId', { usuarioId })
      .andWhere('inscripcion.asignatura.id = :asignaturaId', { asignaturaId })
      .andWhere('inscripcion.fecha >= :fechaLimite', { fechaLimite })
      .getCount();
    if (clasesTomadas >= maxPorAlumno) {
      throw new BadRequestException('Has alcanzado el máximo de clases para esta asignatura en el período');
    }
  }

 

  private calcularClasesDesde(fechaUltima: Date, fechaActual: Date): number {
    // Si son 2 clases por semana -> cada semana cuenta como 2
    const diffSemanas = (fechaActual.getTime() - fechaUltima.getTime()) / (7 * 24 * 60 * 60 * 1000);
    return Math.floor(diffSemanas * 2);
  }


  private clasesDesde(a: Date, b: Date) {
    const diffSemanas = (b.getTime() - a.getTime()) / (7 * 24 * 60 * 60 * 1000);
    return Math.floor(diffSemanas * 2); // 2 clases/semana
  }

async inscribir(usuarioId: number, asignaturaId: number | null, fecha: Date) {
  const maxRepeticiones = await this.configService.getInt('max_repeticiones_por_ramo') || 2;
  const intervaloClases = await this.configService.getInt('intervalo_clases_para_repetir') || 8;

  return await this.dataSource.transaction('READ COMMITTED', async (manager) => {
    // 1) Lock de registros de cupos
    const asignatura = asignaturaId 
      ? await manager.findOne(Asignatura, {
          where: { id: asignaturaId },
          lock: { mode: 'pessimistic_write' },
        })
      : null;

    if (asignaturaId && !asignatura) {
      throw new BadRequestException('Asignatura no encontrada');
    }

    // 2) Validaciones de cupos persistentes
    if (asignatura && asignatura.cuposRestantes <= 0) {
      // ← si cuposRestantes ya es 0, lo reseteamos al cupo total
      asignatura.cuposRestantes = asignatura.cuposTotales;
      await manager.save(asignatura);
    }

    // 3) Validar repeticiones e intervalo del alumno
    const where: any = {
      usuario: { id: usuarioId },
      inscrito: true
    };
    if (asignaturaId) {
      where.asignatura = { id: asignaturaId };
    }

    const prev = await manager.find(Inscripcion, {
      where,
      order: { fecha: 'DESC' },
    });

    if (prev.length >= maxRepeticiones) {
      const ultima = prev[0];
      const clases = this.clasesDesde(ultima.fecha, new Date());
      if (clases < intervaloClases) {
        throw new BadRequestException(
          `Solo puedes inscribirte después de ${intervaloClases} clases`
        );
      }
    }

    // 4) Descontar cupos persistentes
    if (asignatura) {
      asignatura.cuposRestantes -= 1;

      // si después de restar vuelve a cero, reiniciar
      if (asignatura.cuposRestantes <= 0) {
        asignatura.cuposRestantes = asignatura.cuposTotales;
      }

      await manager.save(asignatura);
    }

    // 5) Crear inscripción
    const insc = manager.create(Inscripcion, {
      usuario: { id: usuarioId } as Usuario,
      asignatura: asignaturaId ? ({ id: asignaturaId } as Asignatura) : null,
      inscrito: true,
      fecha: fecha,
      cantidad_limite: null,
    });

    return await manager.save(insc);
  });
}




  async getCupos(asignaturaId: number, tallerId: number, usuarioId: number) {
    const maxRepeticiones = await this.configService.getInt('max_repeticiones_por_ramo') || 2;
    const intervaloClases = await this.configService.getInt('intervalo_clases_para_repetir') || 8;

    const asignatura = await this.asignaturaRepo.findOne({ where: { id: asignaturaId } });
    const taller = await this.tallerRepo.findOne({ where: { id: tallerId, asignaturaId } });
    if (!asignatura || !taller) throw new BadRequestException('Asignatura o taller no encontrado');

        const prev = await this.inscripcionRepo.find({
          where: { usuario: { id: usuarioId }, asignatura: { id: asignaturaId }, inscrito: true },
          order: { fecha: 'DESC' },
        });

    let puedeRepetir = true;
    if (prev.length >= maxRepeticiones) {
      const ultima = prev[0];
      const clases = this.clasesDesde(ultima.fecha, new Date());
      puedeRepetir = clases >= intervaloClases;
    }

    return {
      cuposRamo: asignatura.cuposTotales,
      cuposRamoRestantes: asignatura.cuposRestantes,
      cuposTaller: taller.cuposTotales,
      cuposTallerRestantes: taller.cuposRestantes,
      repeticionesAlumno: prev.length,
      puedeRepetir,
    };
  }

    getWeekRange(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // domingo inicio
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // sábado fin
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
getFourWeekRange(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - 21); // 3 semanas antes + esta semana
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
}
