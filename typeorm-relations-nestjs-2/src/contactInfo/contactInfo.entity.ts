import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn
  } from 'typeorm';
import { Employees } from '../employee/employee.entity';
  
  
  
  @Entity()
  export class contactInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    phone: string;

  
    @Column()
    email: string;

    @Column()
    employeeId: number;


    @OneToOne(() => Employees ,employee => employee.contactInfo ,{ onDelete: 'CASCADE'})
    @JoinColumn()
    employee: Employees;

  
  }
  