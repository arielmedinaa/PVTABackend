import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, IsString, IsInt, Min, Max, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(120)
    age?: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}