import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Column, Entity, In, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('asignatura')
export class Asignatura {
        @PrimaryGeneratedColumn()
         id: number;
    
        @Column()
        nombre: string;
      
        @Column()
        descripcion: string;

        @Column()
        fecha_1:string;

        @Column()
        fecha_2:string;

        @Column()
        cantidad_instancia:number;
        
        @ManyToOne(() => Inscripcion)
        inscripcion:Inscripcion;

    }
