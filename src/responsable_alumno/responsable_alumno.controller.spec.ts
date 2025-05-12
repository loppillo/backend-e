import { Test, TestingModule } from '@nestjs/testing';
import { ResponsableAlumnoController } from './responsable_alumno.controller';
import { ResponsableAlumnoService } from './responsable_alumno.service';

describe('ResponsableAlumnoController', () => {
  let controller: ResponsableAlumnoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsableAlumnoController],
      providers: [ResponsableAlumnoService],
    }).compile();

    controller = module.get<ResponsableAlumnoController>(ResponsableAlumnoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
