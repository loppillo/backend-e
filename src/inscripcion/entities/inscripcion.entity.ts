
import { Asignatura } from "src/asignatura/entities/asignatura.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";

import { Admin, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('inscripcion')
export class Inscripcion {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    fecha: Date;

    @Column()
    inscrito:boolean;

    @Column()
    cantidad_limite:number;

    @OneToMany(()=>Asignatura,(asignatura)=>asignatura.inscripcion)
    asignatura:Asignatura[];

    @OneToMany(()=>Usuario,(user)=>user)
    usuarios:Usuario[];



}
