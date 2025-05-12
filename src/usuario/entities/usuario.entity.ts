import { Asistencia } from "src/asistencia/entities/asistencia.entity";
import { Configuracion } from "src/configuracion/entities/configuracion.entity";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { ResponsableAlumno } from "src/responsable_alumno/entities/responsable_alumno.entity";
import { TipoUsuario } from "src/tipo_usuario/entities/tipo_usuario.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity('usuario')
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;
    
    @Column()
    correo: string;
  
    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @ManyToOne(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios)
    tipo_usuario: TipoUsuario

    @ManyToOne(() => ResponsableAlumno, (responsable_alumno) => responsable_alumno.usuarios)
    responsable_alumno: ResponsableAlumno;

    @ManyToOne(() => Configuracion, (configuracion) => configuracion.usuarios)
    configuracion: Configuracion;   

    @ManyToOne(() => Asistencia, (asistencia) => asistencia.usuarios)
    asistencia: Asistencia;

    @ManyToOne(() => Inscripcion, (ins) => ins.usuarios)
    inscripcion: Inscripcion;

}

