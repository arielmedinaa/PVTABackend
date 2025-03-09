// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/users/auth/guards/auth.guards';
import { RolesGuard } from 'src/users/auth/guards/role.guards';
import { AuthService } from 'src/users/auth/service/auth.service';
import { AuthController } from 'src/users/auth/controller/auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    RolesGuard
  ],
  exports: [
    AuthService,
    AuthGuard,
    RolesGuard
  ],
})
export class AuthModule {}