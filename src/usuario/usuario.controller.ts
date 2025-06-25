import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './usuario.service';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

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

 /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }
*/
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}

