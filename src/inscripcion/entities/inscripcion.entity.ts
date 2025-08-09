import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn,
  JoinColumn
} from 'typeorm';


@Entity()
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'datetime' }) // <--- Cambiado a datetime
  fecha: Date;

  @Column({ type: 'tinyint', default: 1 })
  inscrito: boolean;

  @Column({ type: 'int', nullable: true })
  cantidad_limite: number;

  @ManyToOne(() => Usuario, usuario => usuario.inscripciones)
  usuario: Usuario;


  @ManyToOne(() => Asignatura, { eager: true })
  @JoinColumn({ name: 'asignaturaId' })
  asignatura: Asignatura;


}

