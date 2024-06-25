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

  @Column()
  name!: string;

  @Column()
  description!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.results)
  user: User;

  @OneToMany(() => Habit, (habit) => habit.result)
  habits: Habit[];
}
