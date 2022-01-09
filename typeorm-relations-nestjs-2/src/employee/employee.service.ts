import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeesRepository } from './employee.repository'
import {Employees} from './employee.entity';



@Injectable()
export class EmployeeService {
    constructor(@InjectRepository(Employees) private readonly repo: EmployeesRepository) {}


     create(){

     }

     get(){
         
     }
}
