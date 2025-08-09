import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';

import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Observable } from 'rxjs';
import { UsuarioAsignatura } from 'src/usuario-asignatura/entities/usuario-asignatura.entity';
import { DateTime } from 'luxon';
import { ConfiguracionService } from 'src/configuracion/configuracion.service';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Asignatura)
    private readonly asignaturaRepo: Repository<Asignatura>,
    @InjectRepository(UsuarioAsignatura)
    private readonly usuarioAsignaturaRepo: Repository<UsuarioAsignatura>,
    private readonly configService: ConfiguracionService,
  ) {}

  
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






  findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({
      relations: ['usuario', 'asignatura'],
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
    relations: ['asignatura'], // por si necesitas acceder al objeto completo
  });

  if (!inscripcion) {
    throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
  }

  if (dto.asignaturaId) {
    const asignatura = await this.asignaturaRepo.findOneBy({ id: dto.asignaturaId });
    if (!asignatura) {
      throw new NotFoundException('Asignatura no encontrada');
    }
    inscripcion.asignatura = asignatura;
  }


  return this.inscripcionRepo.save(inscripcion);
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
    .where('inscripcion.usuarioId = :usuarioId', { usuarioId })
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




}
