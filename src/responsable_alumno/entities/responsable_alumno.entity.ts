import { Usuario } from "src/usuario/entities/usuario.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

@Entity('responsable')
export class ResponsableAlumno {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

 @OneToMany(() => Usuario, usuario => usuario.responsable1)
usuarios1: Usuario[];

@OneToMany(() => Usuario, usuario => usuario.responsable2)
usuarios2: Usuario[];

}
