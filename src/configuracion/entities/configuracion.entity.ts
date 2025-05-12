import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('configuracion')
export class Configuracion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    clave: string;

    @Column()
    valor: number;

    @Column('text')
    descripcion: string;


    @OneToMany(()=>Usuario,(usuario)=>usuario.configuracion)
    usuarios:Usuario[];



}
