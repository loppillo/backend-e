import { Module } from '@nestjs/common';
import { ResponsableAlumnoService } from './responsable_alumno.service';
import { ResponsableAlumnoController } from './responsable_alumno.controller';

@Module({
  controllers: [ResponsableAlumnoController],
  providers: [ResponsableAlumnoService],
})
export class ResponsableAlumnoModule {}
