import { Curso } from 'src/curso/entities/curso.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';


@Entity()
export class Taller {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToMany(() => Curso, curso => curso.talleres)
  cursos: Curso[];
}

