import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET_KEY', 'alquetodosenelbarriollamanelsenseivossabeis'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload received:', payload); 
    return {
      userId: payload.sub,
      email: payload.email,
      licenseId: payload.license_id,
      licenseType: payload.license_type,
      database_name: payload.database_name,
      db_host: payload.db_host,
      db_port: payload.db_port,
      db_password: payload.db_password
    };
  }
}