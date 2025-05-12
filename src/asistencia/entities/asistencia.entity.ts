import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('asistencia')
export class Asistencia {
        @PrimaryGeneratedColumn()
        id: number;
    
        @Column()
        cantidad_asistencia:number;
      
        @Column()
        fecha_inicio: string;

        @Column()
        fecha_final:string;

      
        @OneToMany(()=>Usuario,(usuario)=>usuario.asistencia)
        usuarios:Usuario[];
      

}
