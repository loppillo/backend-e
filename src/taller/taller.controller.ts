import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TallerService } from './taller.service';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';

@Controller('taller')
export class TallerController {
  constructor(private readonly tallerService: TallerService) {}

  @Post()
create(@Body() dto: CreateTallerDto) {
  return this.tallerService.create(dto.nombre);
}

@Get()
findAll() {
  return this.tallerService.findAll();
}

}
