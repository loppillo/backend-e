// src/usuario-asignatura/usuario-asignatura.controller.ts
import { Controller, Post, Delete, Get, Param, Query } from '@nestjs/common';
import { UsuarioAsignaturaService } from './usuario-asignatura.service';

@Controller('usuario-asignatura')
export class UsuarioAsignaturaController {
  constructor(private readonly servicio: UsuarioAsignaturaService) {}

  @Post(':usuarioId/:asignaturaId')
  asignar(@Param('usuarioId') usuarioId: number, @Param('asignaturaId') asignaturaId: number) {
    return this.servicio.asignar(usuarioId, asignaturaId);
  }

  @Get('usuario/:usuarioId')
  getAsignaturas(@Param('usuarioId') usuarioId: number) {
    return this.servicio.obtenerAsignaturasPorUsuario(usuarioId);
  }

  @Get('asignatura/:asignaturaId')
  getUsuarios(
    @Param('asignaturaId') asignaturaId: number,
    @Query('tipo') tipo: 'alumno' | 'profesor' | 'admin' = null,
  ) {
    return this.servicio.obtenerUsuariosPorAsignatura(asignaturaId, tipo);
  }

  @Delete(':usuarioId/:asignaturaId')
  eliminar(@Param('usuarioId') usuarioId: number, @Param('asignaturaId') asignaturaId: number) {
    return this.servicio.eliminarRelacion(usuarioId, asignaturaId);
  }
}
