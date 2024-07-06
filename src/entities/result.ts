import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

import { User } from './user';
import { Habit } from './habit';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, length: 100 })
  name!: string;

  @Column()
  description?: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.results, { nullable: false })
  user!: User;

  @OneToMany(() => Habit, (habit) => habit.result)
  habits!: Habit[];
}
