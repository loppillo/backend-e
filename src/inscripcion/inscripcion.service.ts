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
  ) {}

  // in inscripcion.service.ts (modifica el método create):
  async create(dto: CreateInscripcionDto): Promise<Inscripcion> {
  const usuario = await this.usuarioRepo.findOneBy({ id: dto.usuarioId });
  const asignatura = await this.asignaturaRepo.findOneBy({ id: dto.asignaturaId });

  if (!usuario || !asignatura) {
    throw new NotFoundException('Usuario o asignatura no encontrada');
  }

  // 🛠️ Convertir fecha ISO a objeto Date
  const fecha = dto.fecha;

  const inscripcion = this.inscripcionRepo.create({
    fecha: fecha, // <--- 👈 importante incluir la fecha como string ISO
    inscrito: dto.inscrito,
    cantidad_limite: dto.cantidad_limite,
    usuario,
    asignatura,
  });

  return this.inscripcionRepo.save(inscripcion);
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
      fecha: Between(fechaInicio, fechaFin)
    },
    relations: [
      'asignatura',
      'usuario',
      'usuario.tipoUsuario',
      'usuario.responsable1',
  'usuario.responsable2' // ⬅️ Añadido aquí
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
  return this.inscripcionRepo.find({
    where: {
      usuario: { id: usuarioId },
      asignatura: { id: In(asignaturaIds) },
    },
    relations: ['asignatura', 'usuario'],
  });
}


 

}
