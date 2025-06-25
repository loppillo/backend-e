import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateAlumnoDto } from './dto/create-alumno.dto'; // Adjust the path as needed
import { CreateProfesorDto } from './dto/create-profesor.dto'; // Adjust the path as needed
import { CreateAdminDto } from './dto/create-admin.dto'; // Adjust the path as needed
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { TipoUsuario } from '../tipo_usuario/entities/tipo_usuario.entity'; // Adjusted the path to the correct location
import { ResponsableAlumno } from '../responsable_alumno/entities/responsable_alumno.entity'; // Adjust the path as needed
import { Configuracion } from '../configuracion/entities/configuracion.entity'; // Adjust the path as needed
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
   constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,

    @InjectRepository(TipoUsuario)
    private readonly tipoUsuarioRepo: Repository<TipoUsuario>,

    @InjectRepository(ResponsableAlumno)
    private readonly responsableRepo: Repository<ResponsableAlumno>,

    @InjectRepository(Configuracion)
    private readonly configuracionRepo: Repository<Configuracion>,

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


  async findById(id: number): Promise<Usuario> {
    return this.userRepository.findOne({ where: { id } });
  }




}





