import { Module } from '@nestjs/common';
import { TallerService } from './taller.service';
import { TallerController } from './taller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from 'src/curso/entities/curso.entity';
import { Taller } from './entities/taller.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Curso, Taller])],
  controllers: [TallerController],
  providers: [TallerService],
})
export class TallerModule {}
