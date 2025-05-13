import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './entities/asistencia.entity';

@Controller('asistencias')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Get()
  findAll(): Promise<Asistencia[]> {
    return this.asistenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Asistencia> {
    return this.asistenciaService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Asistencia>): Promise<Asistencia> {
    return this.asistenciaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Asistencia>): Promise<Asistencia> {
    return this.asistenciaService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.asistenciaService.delete(id);
  }
}
