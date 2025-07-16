import { Module } from '@nestjs/common';
import { CursoTallerService } from './curso_taller.service';
import { CursoTallerController } from './curso_taller.controller';

@Module({
  controllers: [CursoTallerController],
  providers: [CursoTallerService],
})
export class CursoTallerModule {}
