import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) {}

  async create(userData: Partial<Usuario>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

 findByEmailWithPassword(email: string) {
  return this.userRepository
    .createQueryBuilder('usuario')
    .addSelect(['usuario.password', 'usuario.email'])
    .leftJoinAndSelect('usuario.tipo_usuario', 'tipo_usuario')
    .leftJoinAndSelect('usuario.responsable_alumno', 'responsable_alumno')
    .where('usuario.email = :email', { email })
    .getOne();
}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
