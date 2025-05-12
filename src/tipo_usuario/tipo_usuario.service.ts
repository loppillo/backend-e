import { Injectable } from '@nestjs/common';
import { CreateTipoUsuarioDto } from './dto/create-tipo_usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo_usuario.dto';

@Injectable()
export class TipoUsuarioService {
  create(createTipoUsuarioDto: CreateTipoUsuarioDto) {
    return 'This action adds a new tipoUsuario';
  }

  findAll() {
    return `This action returns all tipoUsuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoUsuario`;
  }

  update(id: number, updateTipoUsuarioDto: UpdateTipoUsuarioDto) {
    return `This action updates a #${id} tipoUsuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoUsuario`;
  }
}
