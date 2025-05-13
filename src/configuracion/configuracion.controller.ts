import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { Configuracion } from './entities/configuracion.entity';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Get()
  findAll(): Promise<Configuracion[]> {
    return this.configuracionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Configuracion> {
    return this.configuracionService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Configuracion>): Promise<Configuracion> {
    return this.configuracionService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Configuracion>): Promise<Configuracion> {
    return this.configuracionService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.configuracionService.delete(id);
  }
}
