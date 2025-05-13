import { Module } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { AsignaturaController } from './asignatura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asignatura])], // <== IMPORTANTE
  providers: [AsignaturaService],
  controllers: [AsignaturaController],

})
export class AsignaturaModule {}
