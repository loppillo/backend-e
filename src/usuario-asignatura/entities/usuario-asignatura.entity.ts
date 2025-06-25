// src/usuario-asignatura/usuario-asignatura.entity.ts
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';


@Entity()
export class UsuarioAsignatura {
  @PrimaryColumn()
  usuarioId: number;

  @PrimaryColumn()
  asignaturaId: number;

  @ManyToOne(() => Usuario, usuario => usuario.asignaturas_asignadas, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Asignatura, asignatura => asignatura.usuarios_asignados, { onDelete: 'CASCADE' })
  asignatura: Asignatura;
}