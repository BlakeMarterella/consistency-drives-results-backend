import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from './user';
import { Habit } from './habit';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @ManyToOne(() => User, (user) => user.results)
  user: User;

  @OneToMany(() => Habit, (habit) => habit.result)
  habits: Habit[];
}
