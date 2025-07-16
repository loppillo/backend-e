import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ResponsableAlumnoService } from './responsable_alumno.service';
import { CreateResponsableAlumnoDto } from './dto/create-responsable_alumno.dto';
import { UpdateResponsableAlumnoDto } from './dto/update-responsable_alumno.dto';
import { CrearResponsable } from './dto/crear-responsable.dto';

@Controller('responsable-alumno')
export class ResponsableAlumnoController {
  constructor(private readonly responsableService: ResponsableAlumnoService) {}

  
  @Post()
  async create(@Body() createResponsableDto: CrearResponsable) {
    return this.responsableService.create(createResponsableDto);
  }

  @Post('asignar')
  async asignarResponsable(@Body() asignacionDto: CreateResponsableAlumnoDto) {
    return this.responsableService.asignarResponsable(asignacionDto);
  }

  @Get('alumno/:alumnoId')
  async obtenerResponsablesDeAlumno(@Param('alumnoId', ParseIntPipe) alumnoId: number) {
    return this.responsableService.obtenerResponsablesDeAlumno(alumnoId);
  }

  @Get('responsable/:responsableId')
  async obtenerAlumnosDeResponsable(@Param('responsableId', ParseIntPipe) responsableId: number) {
    return this.responsableService.obtenerAlumnosDeResponsable(responsableId);
  }

  @Delete(':alumnoId/:responsableId')
  async removerResponsable(
    @Param('alumnoId', ParseIntPipe) alumnoId: number,
    @Param('responsableId', ParseIntPipe) responsableId: number
  ) {
    return this.responsableService.removerResponsable(alumnoId, responsableId);
  }

  @Put(':alumnoId')
  async actualizarResponsables(
    @Param('alumnoId', ParseIntPipe) alumnoId: number,
    @Body() responsablesDto: UpdateResponsableAlumnoDto
  ) {
    return this.responsableService.actualizarResponsables(alumnoId, responsablesDto);
  }

  @Get()
  async obtenerTodasAsignaciones() {
    return this.responsableService.obtenerTodasAsignaciones();
  }

  @Get('disponibles')
  async obtenerResponsablesDisponibles() {
    return this.responsableService.obtenerResponsablesDisponibles();
  }

}


