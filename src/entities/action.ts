import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { Habit } from './habit';
import { Metric } from './metric';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Habit, (habit) => habit.actions)
  habit: Habit;

  @OneToMany(() => Metric, (metric) => metric.action)
  metrics: Metric[];
}
