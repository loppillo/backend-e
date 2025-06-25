import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioAsignaturaController } from './usuario-asignatura.controller';
import { UsuarioAsignaturaService } from './usuario-asignatura.service';

describe('UsuarioAsignaturaController', () => {
  let controller: UsuarioAsignaturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioAsignaturaController],
      providers: [UsuarioAsignaturaService],
    }).compile();

    controller = module.get<UsuarioAsignaturaController>(UsuarioAsignaturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
