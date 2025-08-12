import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfiguracionModule } from 'src/configuracion/configuracion.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { EmailQueue } from './email.queue';
import { BullModule } from '@nestjs/bullmq';



@Module({
   imports: [
   BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
        maxRetriesPerRequest: null, // ✅ Para evitar el warning
      },
    }),
    BullModule.registerQueue({
      name: 'emails',
    }),
    ScheduleModule.forRoot(), // necesario para usar cron y SchedulerRegistry
    ConfiguracionModule,
    UsuarioModule // 👈 este debe estar aquí
  ],
  providers: [MailService,EmailQueue],
  exports: [MailService,EmailQueue], // para que lo puedas usar en otros módulos
})
export class MailModule {}
