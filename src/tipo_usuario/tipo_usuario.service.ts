import { Injectable } from '@nestjs/common';
import { CreateTipoUsuarioDto } from './dto/create-tipo_usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo_usuario.dto';
import { TipoUsuario } from './entities/tipo_usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoUsuarioService {
constructor( @InjectRepository(TipoUsuario)
    private readonly tipoUsuarioRepository: Repository<TipoUsuario>,
){

}
 async findByUsuarioId(usuarioId: number) {
  return this.tipoUsuarioRepository.find({
    where: { id: usuarioId },
    select: ['id', 'tipo'] // Asegúrate de incluir 'tipo'
  });
}


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
  async findTipoUsuarioById(id: number): Promise<TipoUsuario | null> {
    return this.tipoUsuarioRepository.findOne({ where: { id } });
  }
}
