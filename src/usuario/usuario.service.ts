import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateAlumnoDto } from './dto/create-alumno.dto'; // Adjust the path as needed
import { CreateProfesorDto } from './dto/create-profesor.dto'; // Adjust the path as needed
import { CreateAdminDto } from './dto/create-admin.dto'; // Adjust the path as needed
import { Usuario } from './entities/usuario.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { TipoUsuario } from '../tipo_usuario/entities/tipo_usuario.entity'; // Adjusted the path to the correct location
import { ResponsableAlumno } from '../responsable_alumno/entities/responsable_alumno.entity'; // Adjust the path as needed
import { Configuracion } from '../configuracion/entities/configuracion.entity'; // Adjust the path as needed
import { JwtService } from '@nestjs/jwt';
import { Taller } from 'src/taller/entities/taller.entity';
import { Curso } from 'src/curso/entities/curso.entity';

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

    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,

    @InjectRepository(Taller)
    private readonly tallerRepo: Repository<Taller>,

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


async obtenerTalleresPorUsuario(usuarioId: number): Promise<Taller[]> {
  const usuario = await this.userRepository.findOne({
    where: { id: usuarioId },
    relations: ['curso', 'curso.talleres'], // Importantísimo
  });

  if (!usuario || !usuario.curso) {
    throw new NotFoundException('Usuario o curso no encontrado');
  }

  return usuario.curso.talleres;
}

async asignarCursoYTalleres(
  usuarioId: number,
  cursoId: number,
  tallerIds: number[]
): Promise<Usuario> {
  const usuario = await this.userRepository.findOneBy({ id: usuarioId });
  const curso = await this.cursoRepo.findOneBy({ id: cursoId });
  const talleres = await this.tallerRepo.findByIds(tallerIds);

  usuario.curso = curso;
  usuario.curso.talleres = talleres;

  return await this.userRepository.save(usuario);
}

  async getDetalleUsuario(id: number) {
    const usuario = await this.userRepository.findOne({
      where: { id },
      relations: [
        'responsable1',
        'responsable2',
        'curso',
        'curso.talleres',
        'tipoUsuario',
      ],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

async findAlumnosConCorreo(): Promise<Usuario[]> {
  return this.userRepository.find({
    where: {
      tipoUsuario: {
        tipo: 'alumno',
      },
      email: Not(IsNull()),
    },
    relations: ['tipoUsuario'], // por si no tienes eager en algunos entornos
  });
}

   async findAlumnosNoInscritos(): Promise<Usuario[]> {
     return this.userRepository
       .createQueryBuilder('usuario')
       .leftJoinAndSelect('usuario.tipoUsuario', 'tipoUsuario')
       .leftJoinAndSelect('usuario.inscripciones', 'inscripcion')
       .where('tipoUsuario.tipo = :tipo', { tipo: 'alumno' })
       .andWhere('usuario.email IS NOT NULL')
       // Alumnos que NO tengan inscripciones activas
       .andWhere(qb => {
         const subQuery = qb.subQuery()
           .select('1')
           .from('inscripcion', 'inscripcion_sub')
           .where('inscripcion_sub.usuarioId = usuario.id') // Asegúrate de que esta columna sea correcta
           .andWhere('inscripcion_sub.inscrito = true')
           .getQuery();
         return `NOT EXISTS ${subQuery}`;
       })
       .getMany();
   }

async findAlumnosNoInscritosProfe(): Promise<Usuario[]> {
  return this.userRepository
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.tipoUsuario', 'tipoUsuario')
    .leftJoinAndSelect('usuario.inscripciones', 'inscripcion')
    .leftJoinAndSelect('usuario.profesorJefe', 'profesorJefe') // <-- Agregar esto
    .where('tipoUsuario.tipo = :tipo', { tipo: 'alumno' })
    .andWhere('usuario.email IS NOT NULL')
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('1')
        .from('inscripcion', 'inscripcion_sub')
        .where('inscripcion_sub.usuarioId = usuario.id')
        .andWhere('inscripcion_sub.inscrito = true')
        .getQuery();
      return `NOT EXISTS ${subQuery}`;
    })
    .getMany();
}
}



