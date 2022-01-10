import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from './employee/employee.entity';
import { EmployeesRepository } from './employee/employee.repository';
import { ContactInfoRepository } from './contactInfo/contactInfo.repository';
import { contactInfoEntity } from './contactInfo/contactInfo.entity';
import { taskInfoEntity } from './tasks/task.entity';
import { TaskInfoRepository } from './tasks/taskInfo.repository';
import { meetingEntity } from './meetings/meetings.entity';
import { meetingsRepository } from './meetings/meetings.respository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Employees)
    private readonly employeeRepo: EmployeesRepository,
    @InjectRepository(contactInfoEntity)
    private readonly contactRepo: ContactInfoRepository,
    @InjectRepository(meetingEntity)
    private readonly meetingsRepo: meetingsRepository,
    @InjectRepository(taskInfoEntity)
    private readonly taskRepo: TaskInfoRepository,
  ) {}

  async seed() {

    // Employee1 = CEO
    const ceo = this.employeeRepo.create({ name: 'Mr CEO' });
    await this.employeeRepo.save(ceo);

    const ceoContactInfo = this.contactRepo.create({
      email: 'manish@gmail.com',
    });
    ceoContactInfo.employee = ceo;
    await this.contactRepo.save(ceoContactInfo);

    // Employee2 = Manager
    const manager = this.employeeRepo.create({
      name: 'Mr Goswami',
      manager: ceo,
    });
    const task1 = this.taskRepo.create({ name: 'Hire People' });
    await this.taskRepo.save(task1);

    const task2 = this.taskRepo.create({ name: 'Precident to CEO' });
    await this.taskRepo.save(task2);

    manager.tasks = [task1, task2];

    const meeting1 = this.meetingsRepo.create({ zoomurl: 'meeting.com' });
    meeting1.attendies=[ceo]

    await this.employeeRepo.save(manager);


  }

  getHello(): string {
    return 'Hello World!';
  }

  // async create(emp:Partial<Employees>) {
  //   const Emp = await this.employeeRepo.create(emp);
  //   return this.employeeRepo.save(Emp);
  // }
}
