// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { DatabaseService } from './service/database.service';
import { ConnectionContextService } from './context/connection-context.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User],
        logging: true,
      }),
    }),
  ],
  providers: [
    DatabaseService,
    ConnectionContextService
  ],
  exports: [
    DatabaseService,
    ConnectionContextService
  ],
})
export class DatabaseModule {}