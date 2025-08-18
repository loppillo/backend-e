import { Taller } from 'src/taller/entities/taller.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';



@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToMany(() => Taller, taller => taller.cursos, { cascade: true })
  @JoinTable({
    name: 'curso_taller', // tabla intermedia
    joinColumn: { name: 'curso_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'taller_id', referencedColumnName: 'id' }
  })
  talleres: Taller[];

   
  @OneToMany(() => Usuario, usuario => usuario.curso)
  usuarios: Usuario[];


}
