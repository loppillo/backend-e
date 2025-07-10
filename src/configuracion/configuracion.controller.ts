import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Patch, BadRequestException, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { Configuracion } from './entities/configuracion.entity';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

import { AuthGuard } from 'src/auth/guard/auth.guard';


@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}
  @Get()
  findAll(): Promise<Configuracion[]> {
    return this.configuracionService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Configuracion> {
    return this.configuracionService.findOne(id);
  }
  @Post()
  create(@Body() createConfiguracionDto: CreateConfiguracionDto): Promise<Configuracion> {
    return this.configuracionService.create(createConfiguracionDto);
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConfiguracionDto: UpdateConfiguracionDto,
  ): Promise<Configuracion> {
    return this.configuracionService.update(id, updateConfiguracionDto);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.configuracionService.remove(id);
  }
  @Patch('reducir/:clave')
reducirCupo(@Param('clave') clave: string) {
  return this.configuracionService.reducirValor(clave);
}
 @Get('asignatura/:id')
getConfiguracionesPorAsignatura(@Param('id') id: string) {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    throw new BadRequestException('ID inválido');
  }
  return this.configuracionService.getPorAsignatura(idNum);
}

@Get('defecto')
  async getConfiguracionDefecto() {
    return this.configuracionService.getConfiguracionDefecto();
  }

  // Endpoint para verificar si existe configuración específica para una asignatura
  @Get('asignatura/:asignaturaId/existe')
  async existeConfiguracionPorAsignatura(
    @Param('asignaturaId', ParseIntPipe) asignaturaId: number
  ) {
    return this.configuracionService.existeConfiguracionPorAsignatura(asignaturaId);
  }

  // Endpoint para obtener configuración específica por asignatura
  @Get('asignatura/:asignaturaId')
  async getConfiguracionesPorAsignaturas(
    @Param('asignaturaId', ParseIntPipe) asignaturaId: number
  ) {
    return this.configuracionService.getConfiguracionesPorAsignatura(asignaturaId);
  }



}
