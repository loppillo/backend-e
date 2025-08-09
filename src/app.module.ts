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
import { CursoModule } from './curso/curso.module';
import { TallerModule } from './taller/taller.module';
import { CursoTallerModule } from './curso_taller/curso_taller.module';
import { ScheduleModule } from '@nestjs/schedule';






@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
       imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: '162.241.61.254',
        port: 3306,
        username: 'fenfurna_lopo',     // Cambiar según tu configuración
        password: 'b&jTYe?&t^S!', // Cambiar según tu configuración
        database: 'fenfurna_epu', // Cambiar según tu configuración
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

    synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsuarioModule,
    AsignaturaModule,
    InscripcionModule,
    ConfiguracionModule,
    TipoUsuarioModule,
    ResponsableAlumnoModule,
    AsistenciaModule,
    MailModule,
    AuthModule,
    UsuarioAsignaturaModule,
    CursoModule,
    TallerModule,
    CursoTallerModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
