import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import { Queue, Worker } from 'bullmq';

@Injectable()
export class EmailQueue implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailQueue.name);

  private connection: Redis;
  private queue: Queue;
  private worker: Worker;

  private transporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    maxMessages: 20,
    rateLimit: 1,
    port: 465,
    secure: true,
     host: 'c2631687.ferozo.com',
      auth: {
        user: 'ramos.epullay@olemdo.cl',
        pass: 'Fran709EpuRamos@',
      },
  });

  async onModuleInit() {
    this.logger.log('Iniciando conexión Redis y cola de correos...');
    this.connection = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });

    // Crear cola
    this.queue = new Queue('email-queue', { connection: this.connection });

    // Crear worker para procesar los jobs
    this.worker = new Worker(
      'email-queue',
      async job => {
        this.logger.log(`📨 Procesando envío de correo a ${job.data.to}`);
        await this.sendEmail(job.data.to, job.data.subject, job.data.html);
      },
      { connection: this.connection }
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(`❌ Error enviando correo a ${job?.data?.to}: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    await this.worker.close();
    await this.queue.close();
    await this.connection.quit();
    this.logger.log('✅ Cola y conexión Redis cerradas');
  }

  async addEmailJob(to: string, subject: string, html: string) {
    await this.queue.add('send-email', { to, subject, html });
    this.logger.log(`📝 Job agregado para enviar correo a ${to}`);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: '"Soporte" <soporte@tuservidor.com>',
      to,
      subject,
      html,
    });
    this.logger.log(`✅ Correo enviado a ${to}`);
  }
}
