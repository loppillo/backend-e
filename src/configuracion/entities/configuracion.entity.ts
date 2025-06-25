import { Asignatura } from "src/asignatura/entities/asignatura.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('configuracion')
export class Configuracion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clave: string;

  @Column()
  valor: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

 @ManyToOne(() => Asignatura, asignatura => asignatura.configuracion)
@JoinColumn({ name: 'asignaturaId' })
asignatura: Asignatura;

@Column()
asignaturaId: number;
}
