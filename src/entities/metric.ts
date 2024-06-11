import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Action } from './action';

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Action, (action) => action.metrics)
  action: Action;
}
