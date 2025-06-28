import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TipoUsuarioModule } from './tipo_usuario/tipo_usuario.module';
import { ResponsableAlumnoModule } from './responsable_alumno/responsable_alumno.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioAsignaturaModule } from './usuario-asignatura/usuario-asignatura.module';






@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: '54.233.112.14',
    port: 3306,
    username: 'root',
    password: 'M-ZhJcoi>3,S',
    database: 'colegio',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),UsuarioModule,AsignaturaModule, InscripcionModule, ConfiguracionModule, TipoUsuarioModule, ResponsableAlumnoModule, AsistenciaModule, MailModule,AuthModule, UsuarioAsignaturaModule

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
