import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfiguracionModule } from 'src/configuracion/configuracion.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
   imports: [
    ScheduleModule.forRoot(), // necesario para usar cron y SchedulerRegistry
    ConfiguracionModule,
    UsuarioModule // 👈 este debe estar aquí
  ],
  providers: [MailService],
  exports: [MailService], // para que lo puedas usar en otros módulos
})
export class MailModule {}
