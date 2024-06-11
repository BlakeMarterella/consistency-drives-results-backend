import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Result } from './result';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

    @Column({ nullable: false, unique: true, length: 20 })
    username!: string;
    
    @Column({ nullable: false, unique: false, length: 64 })
    firstName!: string;
    
    @Column({ nullable: false, unique: false, length: 64 })
    lastName!: string;

    @Column({ nullable: false, unique: true, length: 255 })
    email!: string;

    @OneToMany(() => Result, (result) => result.user)
    results: Result[];

    @Column({ nullable: false })
    hashPassword!: string;

    @Column({ nullable: false })
    salt!: string;
    
    setPassword(password: string) {
        this.salt = bcrypt.genSaltSync(12);
        this.hashPassword = bcrypt.hashSync(password, this.salt);
    }

    verifyPassword(password: string) {
        const hash = bcrypt.hashSync(password, this.salt);
        return hash === this.hashPassword;
    }
}