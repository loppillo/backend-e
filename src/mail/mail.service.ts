import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'mail.emdool.cl',
      port: 465,
      secure: true,
      auth: {
        user: 'ramos.epullay@emdool.cl',
        pass: 'Fran709EpuRamos#',
      },
    });
  }

  async enviarCorreo(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: '"Sistema de Inscripción"',
      to,
      subject,
      html,
    });
  }
}

