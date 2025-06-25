import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class TipoUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @OneToMany(() => Usuario, usuario => usuario.tipoUsuario)
  usuarios: Usuario[];
}