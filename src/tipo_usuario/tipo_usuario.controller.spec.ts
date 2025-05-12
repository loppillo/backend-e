import { Test, TestingModule } from '@nestjs/testing';
import { TipoUsuarioController } from './tipo_usuario.controller';
import { TipoUsuarioService } from './tipo_usuario.service';

describe('TipoUsuarioController', () => {
  let controller: TipoUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoUsuarioController],
      providers: [TipoUsuarioService],
    }).compile();

    controller = module.get<TipoUsuarioController>(TipoUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
