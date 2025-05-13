import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { Asignatura } from './entities/asignatura.entity';



@Controller('asignatura')
export class AsignaturaController {
 constructor(private readonly asignaturaService: AsignaturaService) {}

  @Get()
  findAll(): Promise<Asignatura[]> {
    return this.asignaturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Asignatura> {
    return this.asignaturaService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Asignatura>): Promise<Asignatura> {
    return this.asignaturaService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Asignatura>): Promise<Asignatura> {
    return this.asignaturaService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.asignaturaService.delete(id);
  }
}
