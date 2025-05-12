import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity('tipo_usuario')
export class TipoUsuario {
     @PrimaryGeneratedColumn()
     id: number;
     
     @Column()
     tipo: string; 

     @OneToMany(()=>Usuario,(usuario)=>usuario.tipo_usuario)
     usuarios:Usuario[];

}
