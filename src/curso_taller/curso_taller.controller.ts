import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CursoTallerService } from './curso_taller.service';
import { CreateCursoTallerDto } from './dto/create-curso_taller.dto';
import { UpdateCursoTallerDto } from './dto/update-curso_taller.dto';

@Controller('curso-taller')
export class CursoTallerController {
  constructor(private readonly cursoTallerService: CursoTallerService) {}

  @Post()
  create(@Body() createCursoTallerDto: CreateCursoTallerDto) {
    return this.cursoTallerService.create(createCursoTallerDto);
  }

  @Get()
  findAll() {
    return this.cursoTallerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoTallerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursoTallerDto: UpdateCursoTallerDto) {
    return this.cursoTallerService.update(+id, updateCursoTallerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursoTallerService.remove(+id);
  }
}
