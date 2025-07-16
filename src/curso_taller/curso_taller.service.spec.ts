import { Test, TestingModule } from '@nestjs/testing';
import { CursoTallerService } from './curso_taller.service';

describe('CursoTallerService', () => {
  let service: CursoTallerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursoTallerService],
    }).compile();

    service = module.get<CursoTallerService>(CursoTallerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
