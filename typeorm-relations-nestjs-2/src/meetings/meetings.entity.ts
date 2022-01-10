import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToMany
  } from 'typeorm';
import { Employees } from '../employee/employee.entity';
  
  
  
  @Entity()
  export class meetingEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    zoomurl: string;


    @ManyToMany(()=> Employees , employee=> employee.meetings)
    attendies:Employees[]
      
   
  
  }
  