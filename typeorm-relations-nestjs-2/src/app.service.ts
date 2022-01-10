import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from './employee/employee.entity';
import { EmployeesRepository } from './employee/employee.repository';
import { ContactInfoRepository } from './contactInfo/contactInfo.repository'
import {  contactInfoEntity } from './contactInfo/contactInfo.entity'
import { taskInfoEntity } from './tasks/task.entity';
import { TaskInfoRepository } from './tasks/taskInfo.repository';
import { meetingEntity } from './meetings/meetings.entity';
import { meetingsRepository } from './meetings/meetings.respository';



@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Employees) private readonly employeeRepo: EmployeesRepository,
    @InjectRepository(contactInfoEntity) private readonly contactRepo: ContactInfoRepository,
    @InjectRepository(meetingEntity) private readonly meetingsRepo: meetingsRepository,
    @InjectRepository(taskInfoEntity) private readonly taskRepo: TaskInfoRepository, 
    ) {}



  
  getHello(): string {
    return 'Hello World!';
  }


  // async create(emp:Partial<Employees>) {
  //   const Emp = await this.employeeRepo.create(emp);
  //   return this.employeeRepo.save(Emp);
  // }
}
