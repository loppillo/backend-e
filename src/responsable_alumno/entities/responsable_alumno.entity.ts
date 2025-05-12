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

    @OneToMany(()=>Usuario,(usuario)=>usuario.responsable_alumno)
    usuarios:Usuario[];
   

}
