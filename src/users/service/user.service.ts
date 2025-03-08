import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        });

        if (existingUser) {
            throw new ConflictException(`El usuario con email ${createUserDto.email} ya existe`);
        }

        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email }
            });

            if (existingUser) {
                throw new ConflictException(`El email ${updateUserDto.email} ya está en uso`);
            }
        }

        this.usersRepository.merge(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<User> {
        const user = await this.findOne(id);
        return this.usersRepository.remove(user);
    }
}