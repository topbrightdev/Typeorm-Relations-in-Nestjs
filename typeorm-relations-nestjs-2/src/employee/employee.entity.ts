import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne
  } from 'typeorm';
import { contactInfoEntity } from './contactInfo.entity';
  
  
  
  @Entity()
  export class Employees {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @OneToOne(()=>contactInfoEntity , contactInfo=>contactInfo.employee)
    contactInfo:contactInfoEntity
  



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
  