import { meetingEntity } from 'src/meetings/meetings.entity';
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable
  } from 'typeorm';
import { contactInfoEntity } from '../contactInfo/contactInfo.entity';
import { taskInfoEntity } from '../tasks/task.entity';
  
  
  
  @Entity()
  export class Employees {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @ManyToOne(()=>Employees , (employee)=> employee.directReports , { onDelete:'SET NULL' })
    manager: Employees

    @OneToMany(()=>Employees , employee=> employee.manager)
    directReports:Employees[]

    @OneToOne(()=>contactInfoEntity , (contactInfo)=>contactInfo.employee)
    contactInfo:contactInfoEntity


    @OneToMany(()=> taskInfoEntity , (tasks)=>tasks.employee)
    tasks:taskInfoEntity[]

    @ManyToMany(()=> meetingEntity , (meetings)=>meetings.attendies)
    @JoinTable()
    meetings : meetingEntity[]


  @AfterInsert()
    logInsert() {
      console.log(`Employee has been inserted with id ${this.id}`);
    }
  
  @AfterUpdate()
    logUpdate(){
      console.log('Employee has been updated with id : ' ,this.id)
    }
  
  
    @AfterRemove()
    logRemove() {
      console.log('Removed Employee with id', this.id);
    }
  
  }
  