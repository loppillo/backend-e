import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


@Entity()
export class Taller {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToMany(() => Curso, curso => curso.talleres)
  cursos: Curso[];
  
   @ManyToOne(() => Asignatura, (a) => a.talleres)
  @JoinColumn({ name: 'asignaturaId' })
  asignatura: Asignatura;

  @Column()
  asignaturaId: number;

  // cupos persistentes
  @Column({ type: 'int', default: 7 })
  cuposTotales: number;

  @Column({ type: 'int', default: 7 })
  cuposRestantes: number;


}

