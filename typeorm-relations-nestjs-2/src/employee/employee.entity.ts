import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany
  } from 'typeorm';
import { contactInfoEntity } from './contactInfo.entity';
import { taskInfoEntity } from './task.entity';
  
  
  
  @Entity()
  export class Employees {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @OneToOne(()=>contactInfoEntity , contactInfo=>contactInfo.employee)
    contactInfo:contactInfoEntity


    @OneToMany(()=> taskInfoEntity , tasks=>tasks.employee)
    tasks:taskInfoEntity[]


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
  