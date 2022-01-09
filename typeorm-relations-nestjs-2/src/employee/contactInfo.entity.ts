import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn
  } from 'typeorm';
import { Employees } from './employee.entity';
  
  
  
  @Entity()
  export class contactInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    phone: string;


      
    @Column()
    email: string;


    @OneToOne(() => Employees ,employee => employee.contactInfo ,{ onDelete: 'CASCADE'})
    @JoinColumn()
    employee: Employees;

  
  }
  