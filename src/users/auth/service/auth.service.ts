// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/service/user.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { 
      sub: user.id, 
      email: user.email,
      nombre: user.nombre
    };

    const secret = this.configService.get<string>('JWT_SECRET');
    console.log(`Usando secret: ${secret?.substring(0, 3)}...`);
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    };
  }
}