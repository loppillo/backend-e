import { Test, TestingModule } from '@nestjs/testing';
import { CursoTallerController } from './curso_taller.controller';
import { CursoTallerService } from './curso_taller.service';

describe('CursoTallerController', () => {
  let controller: CursoTallerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursoTallerController],
      providers: [CursoTallerService],
    }).compile();

    controller = module.get<CursoTallerController>(CursoTallerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
