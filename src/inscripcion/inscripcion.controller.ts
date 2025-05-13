import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { Inscripcion } from './entities/inscripcion.entity';

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Get()
  findAll(): Promise<Inscripcion[]> {
    return this.inscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Inscripcion> {
    return this.inscripcionService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Inscripcion>): Promise<Inscripcion> {
    return this.inscripcionService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Inscripcion>): Promise<Inscripcion> {
    return this.inscripcionService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.inscripcionService.delete(id);
  }
}
