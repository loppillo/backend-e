import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from '../usuario/usuario.module';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { TipoUsuario } from 'src/tipo_usuario/entities/tipo_usuario.entity';
import { TipoUsuarioModule } from 'src/tipo_usuario/tipo_usuario.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, TipoUsuario]),
    UsuarioModule,
    TipoUsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

