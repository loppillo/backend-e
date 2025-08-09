import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { ConfiguracionService } from 'src/configuracion/configuracion.service';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { UsersService } from 'src/usuario/usuario.service';

@Injectable()
export class MailService {
  private transporter;
  private ultimaFechaConfigurada: string | null = null;
  private readonly logger = new Logger(MailService.name);
  constructor( private readonly configService: ConfiguracionService,
    private readonly schedulerRegistry: SchedulerRegistry, private readonly usuarioService: UsersService) {
    this.transporter = nodemailer.createTransport({
      host: 'c2631687.ferozo.com',
      port: 465,
      secure: true,
      auth: {
        user: 'ramos.epullay@olemdo.cl',
        pass: 'Fran709EpuRamos@',
      },
    });
    this.configurarCron1();
    this.configurarCron2();
    this.configurarCron3();
  }


@Cron('0 * * * * *') // Cada minuto
  async recargarCronSiCambioFecha() {
    this.logger.log('🔁 Verificando cambios en configuración de cron...');
    await this.configurarCron1();
    await this.configurarCron2();
    await this.configurarCron3();
    this.logger.log('✅ Cron recargado si hubo cambios'); 
  }

async configurarCron1() {
  const config = await this.configService.findByClave('envio_correos_fecha_1');
  if (!config) return;

  const fechaLuxon = DateTime.fromISO(config.valor, { zone: 'America/Santiago' });
  if (!fechaLuxon.isValid) {
    this.logger.warn('⚠️ Fecha inválida en configuración.');
    return;
  }

  const minutos = fechaLuxon.minute;
  const horas = fechaLuxon.hour;
  const diaSemana = fechaLuxon.weekday % 7; // luxon: 1=lunes → 0=domingo, 6=sábado

  const cronExpr = `${fechaLuxon.minute} ${fechaLuxon.hour} * * ${diaSemana}`;

  // Eliminar cron anterior si existe
  try {
    this.schedulerRegistry.deleteCronJob('envioCorreoConfigurable');
    this.logger.log('♻️ Cron anterior eliminado');
  } catch {}

  const job = new CronJob(cronExpr, () => {
    this.logger.log('📬 Enviando correos programados');
    this.enviarCorreos1();
  });

  this.schedulerRegistry.addCronJob('envioCorreoConfigurable', job);
  job.start();

  this.ultimaFechaConfigurada = config.valor;
  this.logger.log(`✅ Cron programado: ${cronExpr} (día ${diaSemana}, ${horas}:${minutos})`);
}

async configurarCron2() {
  const config = await this.configService.findByClave('envio_correos_fecha_2');
  if (!config) return;

  const fechaLuxon = DateTime.fromISO(config.valor, { zone: 'America/Santiago' });
  if (!fechaLuxon.isValid) {
    this.logger.warn('⚠️ Fecha inválida en configuración.');
    return;
  }

  const minutos = fechaLuxon.minute;
  const horas = fechaLuxon.hour;
  const diaSemana = fechaLuxon.weekday % 7; // luxon: 1=lunes → 0=domingo, 6=sábado

  const cronExpr = `${fechaLuxon.minute} ${fechaLuxon.hour} * * ${diaSemana}`;

  // Eliminar cron anterior si existe
  try {
    this.schedulerRegistry.deleteCronJob('envioCorreoConfigurable');
    this.logger.log('♻️ Cron anterior eliminado');
  } catch {}

  const job = new CronJob(cronExpr, () => {
    this.logger.log('📬 Enviando correos programados');
    this.enviarCorreos2();
  });

  this.schedulerRegistry.addCronJob('envioCorreoConfigurable', job);
  job.start();

  this.ultimaFechaConfigurada = config.valor;
  this.logger.log(`✅ Cron programado: ${cronExpr} (día ${diaSemana}, ${horas}:${minutos})`);
}

async configurarCron3() {
  const config = await this.configService.findByClave('envio_correos_fecha_3');
  if (!config) return;

  const fechaLuxon = DateTime.fromISO(config.valor, { zone: 'America/Santiago' });
  if (!fechaLuxon.isValid) {
    this.logger.warn('⚠️ Fecha inválida en configuración.');
    return;
  }

  const minutos = fechaLuxon.minute;
  const horas = fechaLuxon.hour;
  const diaSemana = fechaLuxon.weekday % 7; // luxon: 1=lunes → 0=domingo, 6=sábado

  const cronExpr = `${fechaLuxon.minute} ${fechaLuxon.hour} * * ${diaSemana}`;

  // Eliminar cron anterior si existe
  try {
    this.schedulerRegistry.deleteCronJob('envioCorreoConfigurable');
    this.logger.log('♻️ Cron anterior eliminado');
  } catch {}

  const job = new CronJob(cronExpr, () => {
    this.logger.log('📬 Enviando correos programados');
    this.enviarCorreos3();
  });

  this.schedulerRegistry.addCronJob('envioCorreoConfigurable', job);
  job.start();

  this.ultimaFechaConfigurada = config.valor;
  this.logger.log(`✅ Cron programado: ${cronExpr} (día ${diaSemana}, ${horas}:${minutos})`);
}


async enviarCorreos1() {
  this.logger.log('📬 Buscando alumnos para enviar correos...');
  
  const alumnos = await this.usuarioService.findAlumnosConCorreo();

  if (!alumnos.length) {
    this.logger.warn('⚠️ No hay alumnos con correo para enviar.');
    return;
  }

  for (const alumno of alumnos) {
    const to = alumno.email;
    const subject = 'Abierto los días de inscripción';
    const html = `<div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #333;">
      <h2 style="color: #2c3e50; margin-bottom: 20px;">👋 Estimado <span style="color: #007bff;">alumno ${alumno.nombre}</span>,</h2>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        están abiertos los días de inscripción para las asignaturas de esta semana, tienes plazo para el día martes hasta las 23:59.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 13px; color: #999; text-align: center;">
        Este es un mensaje automático del sistema. No respondas a este correo.
      </p>
    </div>`;

    try {
      await this.enviarCorreo(to, subject, html);
      this.logger.log(`✅ Correo enviado a ${to}`);
    } catch (err) {
      this.logger.error(`❌ Error al enviar correo a ${to}: ${err.message}`);
    }
  }
}

async enviarCorreos2() {
  this.logger.log('📬 Buscando alumnos **no inscritos** para enviar correos...');

  const alumnos = await this.usuarioService.findAlumnosNoInscritos();

  if (!alumnos.length) {
    this.logger.warn('⚠️ No hay alumnos no inscritos con correo.');
    return;
  }

  for (const alumno of alumnos) {
    const to = alumno.email;
    const subject = 'Ultimo día de inscripción';
    const html = `<div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #333;">
      <h2 style="color: #2c3e50; margin-bottom: 20px;">👋 Estimado <span style="color: #007bff;">alumno ${alumno.nombre}</span>,</h2>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
       te tienes que inscribir hoy, porque no has tomado ramos, recuerda que el plazo es hasta las 23:59 de hoy.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 13px; color: #999; text-align: center;">
        Este es un mensaje automático del sistema. No respondas a este correo.
      </p>
    </div>`;

    try {
      await this.enviarCorreo(to, subject, html);
      this.logger.log(`✅ Correo enviado a ${to}`);
    } catch (err) {
      this.logger.error(`❌ Error al enviar correo a ${to}: ${err.message}`);
    }
  }
}


async enviarCorreos3() {
  this.logger.log('📬 Buscando alumnos **no inscritos** para enviar correos...');

  const alumnos = await this.usuarioService.findAlumnosNoInscritos();

  if (!alumnos.length) {
    this.logger.warn('⚠️ No hay alumnos no inscritos con correo.');
    return;
  }

  for (const alumno of alumnos) {
    const to = alumno.email;
    const subject = 'No mas inscripciones';
    const html = `<div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #333;">
      <h2 style="color: #2c3e50; margin-bottom: 20px;">👋 Estimado <span style="color: #007bff;">alumno ${alumno.nombre}</span>,</h2>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
       te pedimos que te acerques al administrador.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 13px; color: #999; text-align: center;">
        Este es un mensaje automático del sistema. No respondas a este correo.
      </p>
    </div>`;

    try {
      await this.enviarCorreo(to, subject, html);
      this.logger.log(`✅ Correo enviado a ${to}`);
    } catch (err) {
      this.logger.error(`❌ Error al enviar correo a ${to}: ${err.message}`);
    }
  }
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

