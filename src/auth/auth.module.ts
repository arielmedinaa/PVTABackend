import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
              expiresIn: configService.get<string>('JWT_EXPIRATION', '-1'),
            },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
      exports: [AuthService],
})
export class AuthModule {}
