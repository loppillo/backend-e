import { Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

import { UsuarioModule } from 'src/usuario/usuario.module';
import { AsignaturaModule } from 'src/asignatura/asignatura.module';
import { MailModule } from 'src/mail/mail.module';
import { UsuarioAsignatura } from 'src/usuario-asignatura/entities/usuario-asignatura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion]),TypeOrmModule.forFeature([Asignatura]),TypeOrmModule.forFeature([Usuario]),TypeOrmModule.forFeature([UsuarioAsignatura]),
  UsuarioModule,AsignaturaModule,MailModule],
  controllers: [InscripcionController],
  providers: [InscripcionService],
})
export class InscripcionModule {}
