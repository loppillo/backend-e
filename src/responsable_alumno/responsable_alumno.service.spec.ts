import { Test, TestingModule } from '@nestjs/testing';
import { ResponsableAlumnoService } from './responsable_alumno.service';

describe('ResponsableAlumnoService', () => {
  let service: ResponsableAlumnoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsableAlumnoService],
    }).compile();

    service = module.get<ResponsableAlumnoService>(ResponsableAlumnoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
