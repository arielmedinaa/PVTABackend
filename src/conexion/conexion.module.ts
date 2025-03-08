import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            password: 'admin01',
            username: 'postgres',
            entities: [],
            database: 'nestCrud',
            synchronize: true,
            logging: true,
        }),
        UsersModule,
    ]
})
export class ConexionModule { }
