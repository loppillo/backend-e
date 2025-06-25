import { Module } from '@nestjs/common';
import { UsersService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from 'src/tipo_usuario/entities/tipo_usuario.entity';
import { ResponsableAlumno } from 'src/responsable_alumno/entities/responsable_alumno.entity';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario]),TypeOrmModule.forFeature([TipoUsuario]),TypeOrmModule.forFeature([ResponsableAlumno]),TypeOrmModule.forFeature([Configuracion])],
  controllers: [UsuarioController],
  providers: [UsersService],
   exports: [UsersService],
})
export class UsuarioModule {}
