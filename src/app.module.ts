import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseConnectionInterceptor } from './database/interceptor/database-connection.interceptor';
import { ConnectionContextService } from './database/context/connection-context.service';
import { DatabaseService } from './database/service/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (databaseService: DatabaseService, connectionContext: ConnectionContextService) => {
        return new DatabaseConnectionInterceptor(databaseService, connectionContext);
      },
      inject: [DatabaseService, ConnectionContextService]
    },
  ],
})
export class AppModule {}