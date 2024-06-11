import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Result } from './result';
import { Action } from './action';

@Entity()
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @ManyToOne(() => Result, (result) => result.habits)
  result: Result;

  @OneToMany(() => Action, (action) => action.habit)
  actions: Action[];
}