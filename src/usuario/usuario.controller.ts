import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './usuario.service';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AsignarCursoTalleresDto } from './dto/asignarCursoTalleresDto.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsersService) { }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return '';
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  @Get(':id/talleres')
  async getTalleres(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.obtenerTalleresPorUsuario(id);
  }

  @Post(':id/asignar')
async asignarCursoTalleres(
  @Param('id') id: number,
  @Body() dto: AsignarCursoTalleresDto
) {
  return this.usuarioService.asignarCursoYTalleres(id, dto.cursoId, dto.tallerIds);
}

@Get(':id/detalle')
  async getDetalleUsuario(@Param('id') id: number) {
    return this.usuarioService.getDetalleUsuario(+id);
  }



}

