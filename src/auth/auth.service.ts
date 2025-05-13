import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../usuario/usuario.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    
  ) {}

  async register({ name, email, password, role }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    
    if (user) {
      throw new BadRequestException('User already exists');
    }
  
  
    // Crear un nuevo usuario con la región y el rol
    const newUser = await this.usersService.create({
      nombre: name,
      email,
      password: await bcrypt.hash(password, 10),
  
    });
  
    return {
      name: newUser.nombre,
      email: newUser.email,
      

    };
  }
  

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }
  
    // Asegúrate de que 'region' contenga la información correcta
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);
  
    return {
      access_token:token,
      email: user.email,
      
    };
  }
  
  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}

