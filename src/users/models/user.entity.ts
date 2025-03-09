import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    CAJERO = 'cajero'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, nullable: false })
    nombre: string

    @Column({ length: 100, nullable: false, unique: true })
    email: string;

    @Column({ nullable: true, length: 20 })
    phone: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'text' })
    address: string;

    @Column({ nullable: true })
    age: number;

    @Column({ length: 100, nullable: false })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.ADMIN
    })
    role: UserRole;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    isCajero(): boolean {
        return this.role === UserRole.CAJERO;
    }
}