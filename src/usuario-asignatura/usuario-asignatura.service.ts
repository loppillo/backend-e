// src/usuario-asignatura/usuario-asignatura.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UsuarioAsignatura } from './entities/usuario-asignatura.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';


@Injectable()
export class UsuarioAsignaturaService {
  constructor(
    @InjectRepository(UsuarioAsignatura)
    private readonly usuarioAsignaturaRepo: Repository<UsuarioAsignatura>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Asignatura)
    private readonly asignaturaRepo: Repository<Asignatura>,
  ) {}

  async asignar(usuarioId: number, asignaturaId: number) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const asignatura = await this.asignaturaRepo.findOne({ where: { id: asignaturaId } });
    if (!asignatura) throw new NotFoundException('Asignatura no encontrada');

    const existe = await this.usuarioAsignaturaRepo.findOne({ where: { usuarioId, asignaturaId } });
    if (existe) throw new BadRequestException('Ya está asignado');

    const relacion = this.usuarioAsignaturaRepo.create({ usuarioId, asignaturaId });
    return this.usuarioAsignaturaRepo.save(relacion);
  }
async obtenerAsignaturasPorUsuario(usuarioId: number) {
  return this.usuarioAsignaturaRepo.find({
    where: { usuario: { id: usuarioId } }, // Forma más explícita
    relations: ['asignatura', 'usuario'],  // Asegúrate de incluir 'usuario'
  });
}
  async obtenerUsuariosPorAsignatura(asignaturaId: number, tipo: 'alumno' | 'profesor' | 'admin' = null) {
    const relaciones = await this.usuarioAsignaturaRepo.find({
      where: { asignaturaId },
      relations: ['usuario'],
    });

    return tipo ? relaciones.filter(r => r.usuario.tipoUsuario.tipo === tipo).map(r => r.usuario) : relaciones.map(r => r.usuario);
  }

  async eliminarRelacion(usuarioId: number, asignaturaId: number) {
    return this.usuarioAsignaturaRepo.delete({ usuarioId, asignaturaId });
  }
}

