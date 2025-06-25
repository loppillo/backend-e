import { Configuracion } from 'src/configuracion/entities/configuracion.entity';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { UsuarioAsignatura } from 'src/usuario-asignatura/entities/usuario-asignatura.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';


@Entity()
export class Asignatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  fecha_1: string;

  @Column({ nullable: true })
  fecha_2: string;

  @Column({ type: 'int', default: 0 })
  cantidad_instancia: number;


  @OneToMany(() => Inscripcion, inscripcion => inscripcion.asignatura)
  inscripciones: Inscripcion[];

   @OneToMany(() => Configuracion, conf => conf.asignatura)
   configuracion: Configuracion[];

 

   // Relación con tabla intermedia
  @OneToMany(() => UsuarioAsignatura, ua => ua.asignatura)
  usuarios_asignados: UsuarioAsignatura[];
}
