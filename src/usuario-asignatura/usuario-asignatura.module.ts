// src/usuario-asignatura/usuario-asignatura.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioAsignaturaService } from './usuario-asignatura.service';
import { UsuarioAsignaturaController } from './usuario-asignatura.controller';
import { UsuarioAsignatura } from './entities/usuario-asignatura.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UsuarioAsignatura, Usuario, Asignatura])],
  providers: [UsuarioAsignaturaService],
  controllers: [UsuarioAsignaturaController],
})
export class UsuarioAsignaturaModule {}
