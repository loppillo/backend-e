import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioAsignaturaService } from './usuario-asignatura.service';

describe('UsuarioAsignaturaService', () => {
  let service: UsuarioAsignaturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioAsignaturaService],
    }).compile();

    service = module.get<UsuarioAsignaturaService>(UsuarioAsignaturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
