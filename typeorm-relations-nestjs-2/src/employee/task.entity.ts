import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToOne
  } from 'typeorm';
import { Employees } from './employee.entity';
  
  
  
  @Entity()
  export class taskInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;


    @ManyToOne(()=> Employees , employee=> employee.tasks ,{ onDelete:'SET NULL'})
    employee:Employees
      
   
  
  }
  