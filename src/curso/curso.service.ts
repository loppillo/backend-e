import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Taller } from "src/taller/entities/taller.entity";
import { Repository, In } from "typeorm";
import { Curso } from "./entities/curso.entity";
import { AsignarTalleresDto } from "./entities/AsignarTalleresDto.dto";
import { Usuario } from "src/usuario/entities/usuario.entity";

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepo: Repository<Curso>,

    @InjectRepository(Taller)
    private tallerRepo: Repository<Taller>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Taller>,
  ) {}

  async create(nombre: string, tallerIds: number[]): Promise<Curso> {
    const talleres = await this.tallerRepo.findBy({ id: In(tallerIds) });

    const curso = this.cursoRepo.create({ nombre, talleres });
    return this.cursoRepo.save(curso);
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoRepo.find({ relations: ['talleres'] });
  }

  async findById(id: number): Promise<Curso> {
    return this.cursoRepo.findOne({
      where: { id },
      relations: ['talleres']
    });
  }



  async asignarTalleres(cursoId: number, dto: AsignarTalleresDto): Promise<Curso> {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId }, relations: ['talleres'] });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const talleres = await this.tallerRepo.findBy({ id: In(dto.tallerIds) });
    if (!talleres.length) throw new NotFoundException('Talleres no encontrados');

    curso.talleres = talleres; // reemplaza
    return this.cursoRepo.save(curso);
  }

  async obtenerTalleres(cursoId: number): Promise<Taller[]> {
    const curso = await this.cursoRepo.findOne({
      where: { id: cursoId },
      relations: ['talleres']
    });

    if (!curso) throw new NotFoundException('Curso no encontrado');

    return curso.talleres;
  }

  

}
