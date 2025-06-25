import { Module } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';
import { Configuracion } from './entities/configuracion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from 'src/asignatura/entities/asignatura.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Configuracion]),TypeOrmModule.forFeature([Asignatura])],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService],
})
export class ConfiguracionModule {}
