import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponsableAlumnoService } from './responsable_alumno.service';
import { CreateResponsableAlumnoDto } from './dto/create-responsable_alumno.dto';
import { UpdateResponsableAlumnoDto } from './dto/update-responsable_alumno.dto';

@Controller('responsable-alumno')
export class ResponsableAlumnoController {
  constructor(private readonly responsableAlumnoService: ResponsableAlumnoService) {}

  @Post()
  create(@Body() createResponsableAlumnoDto: CreateResponsableAlumnoDto) {
    return this.responsableAlumnoService.create(createResponsableAlumnoDto);
  }

  @Get()
  findAll() {
    return this.responsableAlumnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsableAlumnoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsableAlumnoDto: UpdateResponsableAlumnoDto) {
    return this.responsableAlumnoService.update(+id, updateResponsableAlumnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsableAlumnoService.remove(+id);
  }
}
