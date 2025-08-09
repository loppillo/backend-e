import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Patch, BadRequestException, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { Configuracion } from './entities/configuracion.entity';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) { }
  @Put('updates')
  updates(@Body() body: { clave: string; valor: string }) {
    return this.configuracionService.updates(body.clave, body.valor);
  }

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


  @Get('defecto')
  async getConfiguracionDefecto() {
    return this.configuracionService.getConfiguracionDefecto();
  }

  // Endpoint para verificar si existe configuración específica para una asignatura


  @Get('inscripcion/activa')
  async esInscripcionActiva(): Promise<boolean> {
    return this.configuracionService.esPeriodoInscripcionActivo();
  }

  // Obtener el valor como string
  @Get('valor/:clave')
  async obtenerValor(@Param('clave') clave: string) {
    return { clave, valor: await this.configuracionService.obtenerValor(clave) };
  }

  // Obtener el valor como número
  @Get('numero/:clave')
  async obtenerNumero(@Param('clave') clave: string) {
    return { clave, valor: await this.configuracionService.obtenerNumero(clave) };
  }

  // Actualizar un valor (string o número)
  @Patch(':clave')
  async actualizarValor(
    @Param('clave') clave: string,
    @Body('valor') nuevoValor: string,
  ) {
    await this.configuracionService.actualizarValor(clave, nuevoValor);
    return { mensaje: `Configuración '${clave}' actualizada a '${nuevoValor}'` };
  }

  // Incrementar valor numérico
  @Patch('incrementar/:clave')
  async incrementar(@Param('clave') clave: string) {
    await this.configuracionService.incrementar(clave);
    return { mensaje: `Configuración '${clave}' incrementada` };
  }

  // Reiniciar valor (a 1)
  @Patch('reiniciar/:clave')
  async reiniciar(@Param('clave') clave: string) {
    await this.configuracionService.reiniciar(clave);
    return { mensaje: `Configuración '${clave}' reiniciada a 1` };
  }

}
