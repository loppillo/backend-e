import { Module } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { AsignaturaController } from './asignatura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Asignatura]),TypeOrmModule.forFeature([Configuracion]),TypeOrmModule.forFeature([Inscripcion])], // <== IMPORTANTE
  providers: [AsignaturaService],
  controllers: [AsignaturaController],
exports: [AsignaturaService], 
})
export class AsignaturaModule {}
