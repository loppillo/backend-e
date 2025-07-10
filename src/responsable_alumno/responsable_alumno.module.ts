import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsableAlumnoService } from './responsable_alumno.service';
import { ResponsableAlumnoController } from './responsable_alumno.controller';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { ResponsableAlumno } from './entities/responsable_alumno.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, ResponsableAlumno]) // ← Agregar ambas entidades
  ],
  controllers: [ResponsableAlumnoController],
  providers: [ResponsableAlumnoService],
  exports: [ResponsableAlumnoService] // Si necesitas exportar el servicio
})
export class ResponsableAlumnoModule {}
