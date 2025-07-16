import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'c2631687.ferozo.com',
      port: 465,
      secure: true,
      auth: {
        user: 'ramos.epullay@olemdo.cl',
        pass: 'Fran709EpuRamos@',
      },
    });
  }

  

  async enviarCorreo(to:string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: '"Sistema de Inscripción"',
      to,
      subject,
      html,
    });
  }
}

