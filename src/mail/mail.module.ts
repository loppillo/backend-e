import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // para que lo puedas usar en otros módulos
})
export class MailModule {}
