import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponsableAlumnoDto } from './dto/create-responsable_alumno.dto';
import { UpdateResponsableAlumnoDto } from './dto/update-responsable_alumno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { ResponsableAlumno } from './entities/responsable_alumno.entity';
import { CrearResponsable } from './dto/crear-responsable.dto';

@Injectable()
export class ResponsableAlumnoService {
   constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(ResponsableAlumno)
    private responsableRepository: Repository<ResponsableAlumno>,
  ) {}

  async asignarResponsable(asignacionDto: CreateResponsableAlumnoDto) {
    const { alumnoId, responsableId, tipo } = asignacionDto;

    // Verificar que el alumno existe
    const alumno = await this.usuarioRepository.findOne({
      where: { id: alumnoId },
      relations: ['responsable1', 'responsable2', 'tipoUsuario']
    });

    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }

   

    // Verificar que el responsable existe
    const responsable = await this.responsableRepository.findOne({
      where: { id: responsableId }
    });

    if (!responsable) {
      throw new NotFoundException('Responsable no encontrado');
    }

    // Verificar que el slot del responsable esté disponible
    if (tipo === 'responsable1' && alumno.responsable1) {
      throw new BadRequestException('El alumno ya tiene un responsable principal asignado');
    }
    if (tipo === 'responsable2' && alumno.responsable2) {
      throw new BadRequestException('El alumno ya tiene un responsable secundario asignado');
    }

    // Verificar que no sea el mismo responsable en ambos slots
    if (tipo === 'responsable1' && alumno.responsable2?.id === responsableId) {
      throw new BadRequestException('Este responsable ya está asignado como responsable secundario');
    }
    if (tipo === 'responsable2' && alumno.responsable1?.id === responsableId) {
      throw new BadRequestException('Este responsable ya está asignado como responsable principal');
    }

    // Asignar responsable
    if (tipo === 'responsable1') {
      alumno.responsable1 = responsable;
    } else {
      alumno.responsable2 = responsable;
    }

    await this.usuarioRepository.save(alumno);

    return {
      message: `Responsable ${tipo} asignado exitosamente`,
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido
      },
      responsable: {
        id: responsable.id,
        nombre: responsable.nombre,
        correo: responsable.correo
      },
      tipo
    };
  }

  async obtenerResponsablesDeAlumno(alumnoId: number) {
    const alumno = await this.usuarioRepository.findOne({
      where: { id: alumnoId },
      relations: ['responsable1', 'responsable2']
    });

    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }

    return {
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido
      },
      responsables: {
        responsable1: alumno.responsable1 || null,
        responsable2: alumno.responsable2 || null
      }
    };
  }

  async obtenerAlumnosDeResponsable(responsableId: number) {
    const responsable = await this.responsableRepository.findOne({
      where: { id: responsableId },
      relations: ['usuarios1', 'usuarios2']
    });

    if (!responsable) {
      throw new NotFoundException('Responsable no encontrado');
    }

    return {
      responsable: {
        id: responsable.id,
        nombre: responsable.nombre,
        correo: responsable.correo
      },
      alumnos: {
        comoResponsable1: responsable.usuarios1 || [],
        comoResponsable2: responsable.usuarios2 || []
      }
    };
  }

  async removerResponsable(alumnoId: number, responsableId: number) {
    const alumno = await this.usuarioRepository.findOne({
      where: { id: alumnoId },
      relations: ['responsable1', 'responsable2']
    });

    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }

    let tipoRemovido = '';
    
    if (alumno.responsable1?.id === responsableId) {
      alumno.responsable1 = null;
      tipoRemovido = 'responsable1';
    } else if (alumno.responsable2?.id === responsableId) {
      alumno.responsable2 = null;
      tipoRemovido = 'responsable2';
    } else {
      throw new BadRequestException('El responsable no está asignado a este alumno');
    }

    await this.usuarioRepository.save(alumno);

    return {
      message: `Responsable ${tipoRemovido} removido exitosamente`
    };
  }

  async actualizarResponsables(alumnoId: number, responsablesDto: UpdateResponsableAlumnoDto) {
    const alumno = await this.usuarioRepository.findOne({
      where: { id: alumnoId },
      relations: ['responsable1', 'responsable2']
    });

    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }

    // Actualizar responsable1 si se proporciona
    if (responsablesDto.responsable1Id !== undefined) {
      if (responsablesDto.responsable1Id === null) {
        alumno.responsable1 = null;
      } else {
        const responsable1 = await this.responsableRepository.findOne({
          where: { id: responsablesDto.responsable1Id }
        });
        if (!responsable1) {
          throw new NotFoundException('Responsable1 no encontrado');
        }
        alumno.responsable1 = responsable1;
      }
    }

    // Actualizar responsable2 si se proporciona
    if (responsablesDto.responsable2Id !== undefined) {
      if (responsablesDto.responsable2Id === null) {
        alumno.responsable2 = null;
      } else {
        const responsable2 = await this.responsableRepository.findOne({
          where: { id: responsablesDto.responsable2Id }
        });
        if (!responsable2) {
          throw new NotFoundException('Responsable2 no encontrado');
        }
        alumno.responsable2 = responsable2;
      }
    }

    // Validar que no sea el mismo responsable en ambos slots
    if (alumno.responsable1 && alumno.responsable2 && 
        alumno.responsable1.id === alumno.responsable2.id) {
      throw new BadRequestException('No se puede asignar el mismo responsable en ambos slots');
    }

    await this.usuarioRepository.save(alumno);

    return {
      message: 'Responsables actualizados exitosamente',
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido
      },
      responsables: {
        responsable1: alumno.responsable1,
        responsable2: alumno.responsable2
      }
    };
  }

  async obtenerTodasAsignaciones() {
    const alumnos = await this.usuarioRepository.find({
      relations: ['responsable1', 'responsable2', 'tipoUsuario'],
      where: { tipoUsuario: { tipo: 'alumno' } }
    });

    return alumnos.map(alumno => ({
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        email: alumno.email
      },
      responsables: {
        responsable1: alumno.responsable1 || null,
        responsable2: alumno.responsable2 || null
      }
    }));
  }

  async obtenerResponsablesDisponibles() {
    return await this.responsableRepository.find({
      select: ['id', 'nombre', 'correo']
    });
  }


  async create(createResponsableDto: CrearResponsable): Promise<ResponsableAlumno> {
    // Verificar que el correo no exista
    const existeCorreo = await this.responsableRepository.findOne({
      where: { correo: createResponsableDto.correo }
    });

    if (existeCorreo) {
      throw new ConflictException('Ya existe un responsable con este correo');
    }

    const responsable = this.responsableRepository.create({
      ...createResponsableDto,
    });

    return this.responsableRepository.save(responsable);
  }
}
