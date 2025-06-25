import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipo_usuario.service';
import { TipoUsuarioController } from './tipo_usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from './entities/tipo_usuario.entity';

@Module({
    imports:[TypeOrmModule.forFeature([TipoUsuario])],
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService],
  exports: [TipoUsuarioService], // Exporta el servicio aquí
})
export class TipoUsuarioModule {}
