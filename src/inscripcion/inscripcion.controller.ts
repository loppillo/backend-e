import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe, Put, BadRequestException, NotFoundException } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';

import { UsersService } from 'src/usuario/usuario.service';
import { AsignaturaService } from 'src/asignatura/asignatura.service';
import { MailService } from 'src/mail/mail.service';

@Controller('inscripciones')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService,

    private readonly usuarioService: UsersService,
    private readonly asignaturaService: AsignaturaService,
    private readonly mailService: MailService, // Asegúrate de que MailService esté correctamente importado y configurado
  ) {}

    @Post('correo')
  async enviarCorreoConfirmacion(@Body() body: { alumnoId: number; asignaturas: number[] }) {
    try {
      // Filtrar IDs válidos antes de cualquier consulta
      const asignaturaIds = (body.asignaturas || [])
        .map(id => Number(id))
        .filter(id => Number.isInteger(id) && id > 0);
      if (!asignaturaIds.length) {
        return { message: 'No se enviaron asignaturas válidas.' };
      }
      const usuario = await this.usuarioService.findById(body.alumnoId);
      const asignaturas = await this.asignaturaService.findByIds(asignaturaIds);
      const inscripciones = await this.inscripcionService.findByUsuarioAndAsignaturas(usuario.id, asignaturaIds);
      const listaHtml = asignaturas.map((a) => `<li>${a.nombre}</li>`).join('');

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #333;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">👋 Hola <span style="color: #007bff;">${usuario.nombre}</span>,</h2>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Te has inscrito correctamente en las siguientes asignaturas:
          </p>
          <ul style="list-style-type: disc; padding-left: 20px; font-size: 15px; color: #444; margin-bottom: 25px;">
            ${listaHtml}
          </ul>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
            <strong>Fecha de envío:</strong> ${new Date().toLocaleString()}
          </p>
          <p style="font-size: 14px; color: #666;">
            <strong>Fechas de inscripción:</strong> ${inscripciones.map(i => i.fecha).join(', ')}
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 13px; color: #999; text-align: center;">
            Este es un mensaje automático del sistema. No respondas a este correo.
          </p>
        </div>
      `;

      await this.mailService.enviarCorreo(usuario.email, 'Confirmación de inscripción', html);
      return { message: 'Correo enviado correctamente' };
    } catch (error) {
      return { message: 'Error al enviar correo', error: error?.message || error };
    }
  }



    @Get('por-fecha-usuario')
  async findByFechaAndUsuario(
    @Query('fecha') fecha: string,
    @Query('usuarioId') usuarioId: number,
  ) {
    return this.inscripcionService.findByFechaAndUsuario(fecha, Number(usuarioId));
  }

  @Post()
  create(@Body() dto: CreateInscripcionDto) {
    return this.inscripcionService.create(dto);
  }

  @Get()
  findAll() {
    return this.inscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionService.findOne(+id);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscripcionService.remove(+id);
  }

  @Put(':id')
updates(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateInscripcionDto: UpdateInscripcionDto,
): Promise<Inscripcion> {
  return this.inscripcionService.updates(id, updateInscripcionDto);
}



  @Get('usuario/:usuarioId')
async getInscripcionesPorUsuario(@Param('usuarioId') usuarioId: number) {
  return this.inscripcionService.getInscripcionesPorUsuario(usuarioId);
}

@Get('usuario/:usuarioId/semana')
getInscripcionesPorUsuarioSemana(
  @Param('usuarioId') usuarioId: number,
  @Query('fechaInicio') fechaInicio: string,
  @Query('fechaFin') fechaFin: string,
) {
  return this.inscripcionService.getInscripcionesPorUsuarioSemana(usuarioId, fechaInicio, fechaFin);
}


 @Post('correo/responsable')
async enviarCorreoApoderado(@Body() body: { alumnoId: number; asignaturas: number[] }) {
  // Filtrar IDs válidos antes de cualquier consulta
  const asignaturaIds = (body.asignaturas || [])
    .map(id => Number(id))
    .filter(id => Number.isFinite(id) && Number.isInteger(id) && id > 0);
  if (!asignaturaIds.length) {
    return { message: 'No se enviaron asignaturas válidas.' };
  }
  const usuario = await this.usuarioService.findById(body.alumnoId);
  if (!usuario) {
    return { message: 'Usuario no encontrado.' };
  }
  const asignaturas = await this.asignaturaService.findByIds(asignaturaIds);
  const inscripciones = await this.inscripcionService.findByUsuarioAndAsignaturas(usuario.id, asignaturaIds);
  const listaHtml = asignaturas.map((a) => `<li>${a.nombre}</li>`).join('');

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #333;">
      <h2 style="color: #2c3e50; margin-bottom: 20px;">👋 Hola <span style="color: #007bff;">El alumno ${usuario.nombre} y apoderados ${usuario.responsable1?.nombre}-- ${usuario.responsable2.nombre}</span>,</h2>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        Se ha inscrito correctamente en las siguientes asignaturas:
      </p>
      <ul style="list-style-type: disc; padding-left: 20px; font-size: 15px; color: #444; margin-bottom: 25px;">
        ${listaHtml}
      </ul>
      <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>Fecha de envío:</strong> ${new Date().toLocaleString()}
      </p>
      <p style="font-size: 14px; color: #666;">
        <strong>Fechas de inscripción:</strong> ${inscripciones.map(i => i.fecha).join(', ')}
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 13px; color: #999; text-align: center;">
        Este es un mensaje automático del sistema. No respondas a este correo.
      </p>
    </div>
  `;

  if (usuario.responsable1?.correo) {
    await this.mailService.enviarCorreo(usuario.responsable1.correo, 'Confirmación de inscripción', html);
  }
  if (usuario.responsable2?.correo) {
    await this.mailService.enviarCorreo(usuario.responsable2.correo, 'Confirmación de inscripción', html);
  }

  return { message: 'Correo enviado correctamente' };
}

@Get('usuario/:id/asignaturas-contador')
async obtenerContador(@Param('id') id: number) {
  return this.inscripcionService.contarAsignaturasPorUsuario(id);
}

@Get('verificar/:usuarioId/:asignaturaId')
async verificarRestricciones(
  @Param('usuarioId', ParseIntPipe) usuarioId: number,
  @Param('asignaturaId', ParseIntPipe) asignaturaId: number,
) {
  await this.inscripcionService.verificarRestriccionesInscripcion(usuarioId, asignaturaId);
  return { puedeInscribirse: true }; // si no lanza excepción, puede inscribirse
}


}


