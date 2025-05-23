import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuarioModule } from './tipo_usuario/tipo_usuario.module';
import { ResponsableAlumnoModule } from './responsable_alumno/responsable_alumno.module';
import { AsistenciaModule } from './asistencia/asistencia.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'polo6969',
    database: 'colegio',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),UsuarioModule,AsignaturaModule, InscripcionModule, ConfiguracionModule, TipoUsuarioModule, ResponsableAlumnoModule, AsistenciaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
