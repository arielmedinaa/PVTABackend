import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { DatabaseService } from '../../database/service/database.service';
import { ConnectionContextService } from '../../database/context/connection-context.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserService {
    constructor(
        private databaseService: DatabaseService,
        private connectionContext: ConnectionContextService,
        @Inject(REQUEST) private readonly request: any
    ) {}

    private async getUserRepository() {
        const requestId = this.request.requestId;
        const licenseData = this.connectionContext.getLicenseData(requestId);
        if (!licenseData) {
            throw new Error('No license data available for database connection');
        }
        
        const dataSource = await this.databaseService.createDataSource(licenseData);
        return dataSource.getRepository(User);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const usersRepository = await this.getUserRepository();
        
        const existingUser = await usersRepository.findOne({
            where: { email: createUserDto.email }
        });

        if (existingUser) {
            throw new ConflictException(`El usuario con email ${createUserDto.email} ya existe`);
        }

        const user = usersRepository.create(createUserDto);
        return usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        const usersRepository = await this.getUserRepository();
        return usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const usersRepository = await this.getUserRepository();
        const user = await usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const usersRepository = await this.getUserRepository();
        const user = await usersRepository.findOne({ where: { email } });
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const usersRepository = await this.getUserRepository();
        const user = await this.findOne(id);

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await usersRepository.findOne({
                where: { email: updateUserDto.email }
            });

            if (existingUser) {
                throw new ConflictException(`El email ${updateUserDto.email} ya está en uso`);
            }
        }

        usersRepository.merge(user, updateUserDto);
        return usersRepository.save(user);
    }

    async remove(id: string): Promise<User> {
        const usersRepository = await this.getUserRepository();
        const user = await this.findOne(id);
        return usersRepository.remove(user);
    }
}