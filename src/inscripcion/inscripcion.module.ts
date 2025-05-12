import { Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'typeorm';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';

@Module({
  imports: [],
  controllers: [InscripcionController],
  providers: [InscripcionService],
})
export class InscripcionModule {}
