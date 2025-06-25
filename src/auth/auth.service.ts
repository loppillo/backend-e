import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { TipoUsuario } from 'src/tipo_usuario/entities/tipo_usuario.entity';
import { TipoUsuarioService } from 'src/tipo_usuario/tipo_usuario.service';


@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsersService,
    private jwtService: JwtService,
    private tipoUsuarioService: TipoUsuarioService, // Assuming this is the service for TipoUsuario
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usuarioService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

async login(email: string, password: string) {
  let user = await this.validateUser(email, password);
  if (!user) throw new UnauthorizedException('Credenciales inválidas');

  // Si no se cargó tipoUsuario, vuelve a buscar con la relación
  if (!user.tipoUsuario?.tipo) {
    user = await this.usuarioService.findOneByEmail(email);
  }

  const payload = { 
    sub: user.id, 
    email: user.email, 
    tipoUsuarioId: user.tipoUsuario.id,
    tipo: user.tipoUsuario.tipo // <-- este es el string: "alumno", "profesor", etc.
  };

  return {
    access_token: this.jwtService.sign(payload),
    user,
    tipoUsuario: user.tipoUsuario.tipo
  };
}

   

  async register({ nombre, apellido, email, password, tipoUsuarioId }: RegisterDto) {
    const user = await this.usuarioService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    // Buscar el objeto TipoUsuario usando el id proporcionado
    const tipoUsuarioEntity = await this.tipoUsuarioService.findTipoUsuarioById(tipoUsuarioId);
    if (!tipoUsuarioEntity) {
      throw new BadRequestException('TipoUsuario no encontrado');
    }

    // Crear un nuevo usuario y vincularlo con TipoUsuario
    const newUser = await this.usuarioService.create({
      nombre,
      apellido, // <-- Agrega el apellido aquí
      email,
      password: await bcrypt.hash(password, 10),
      tipoUsuario: tipoUsuarioEntity,
    });

    return {
      name: newUser.nombre,
      apellido: newUser.apellido,
      email: newUser.email,
      tipo_usuario: newUser.tipoUsuario.tipo,
    };
  }
}