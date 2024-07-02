import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';

import { Habit } from './habit';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, length: 32 })
  name!: string;

  @Column({ nullable: false, length: 7 })
  color!: string;

  @ManyToOne(() => Habit, (habit) => habit.actions)
  habit!: Habit;
}
