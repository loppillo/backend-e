import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { AsignarTalleresDto } from './entities/AsignarTalleresDto.dto';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) { }

  @Post()
  create(@Body() dto: CreateCursoDto) {
    return this.cursoService.create(dto.nombre, dto.tallerIds);
  }

  @Get()
  findAll() {
    return this.cursoService.findAll();
  }

  @Post(':id/asignar-talleres')
  asignarTalleres(
    @Param('id', ParseIntPipe) cursoId: number,
    @Body() dto: AsignarTalleresDto
  ) {
    return this.cursoService.asignarTalleres(cursoId, dto);
  }

  @Get(':id/talleres')
  obtenerTalleres(@Param('id', ParseIntPipe) cursoId: number) {
    return this.cursoService.obtenerTalleres(cursoId);
  }



}
