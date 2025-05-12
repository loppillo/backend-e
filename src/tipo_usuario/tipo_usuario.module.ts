import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipo_usuario.service';
import { TipoUsuarioController } from './tipo_usuario.controller';

@Module({
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService],
})
export class TipoUsuarioModule {}
