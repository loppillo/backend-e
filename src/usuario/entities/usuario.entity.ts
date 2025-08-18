import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Asistencia } from 'src/asistencia/entities/asistencia.entity';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { TipoUsuario } from 'src/tipo_usuario/entities/tipo_usuario.entity';
import { ResponsableAlumno } from 'src/responsable_alumno/entities/responsable_alumno.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToMany, ManyToMany, JoinTable,
  JoinColumn
} from 'typeorm';
import { UsuarioAsignatura } from 'src/usuario-asignatura/entities/usuario-asignatura.entity';
import { Curso } from 'src/curso/entities/curso.entity';


@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @ManyToOne(() => TipoUsuario, tipo => tipo.usuarios, { eager: true })
  @JoinColumn({ name: 'tipoUsuarioId' })
  tipoUsuario: TipoUsuario;

  @ManyToOne(() => ResponsableAlumno, { eager: true })
  @JoinColumn({ name: 'responsable1Id' })
  responsable1: ResponsableAlumno;

  @ManyToOne(() => ResponsableAlumno, { eager: true })
  @JoinColumn({ name: 'responsable2Id' })
  responsable2: ResponsableAlumno;

  @ManyToOne(() => Asistencia, asistencia => asistencia.usuarios, { nullable: true })
  asistencia: Asistencia;

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.usuario)
  inscripciones: Inscripcion[];

  // Relación con tabla intermedia usuario-asignatura
  @OneToMany(() => UsuarioAsignatura, ua => ua.usuario)
  asignaturas_asignadas: UsuarioAsignatura[];

  @ManyToOne(() => Curso, curso => curso.usuarios, { eager: true })
  curso: Curso;

   // Nuevo campo: profesor jefe
  @ManyToOne(() => Usuario, usuario => usuario.alumnos, { nullable: true })
  profesorJefe: Usuario;
  @OneToMany(() => Usuario, usuario => usuario.profesorJefe)
  alumnos: Usuario[];

}



