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
  id!: number;

  @Column({ nullable: false, length: 100 })
  name!: string;

  @Column()
  description!: string;

  @Column({ nullable: false, length: 7 })
  color!: string;

  @ManyToOne(() => Result, (result) => result.habits, { nullable: false })
  result!: Result;

  @OneToMany(() => Action, (action) => action.habit)
  actions!: Action[];
}