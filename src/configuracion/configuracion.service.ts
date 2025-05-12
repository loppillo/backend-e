import { Injectable } from '@nestjs/common';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@Injectable()
export class ConfiguracionService {
  create(createConfiguracionDto: CreateConfiguracionDto) {
    return 'This action adds a new configuracion';
  }

  findAll() {
    return `This action returns all configuracion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configuracion`;
  }

  update(id: number, updateConfiguracionDto: UpdateConfiguracionDto) {
    return `This action updates a #${id} configuracion`;
  }

  remove(id: number) {
    return `This action removes a #${id} configuracion`;
  }
}
