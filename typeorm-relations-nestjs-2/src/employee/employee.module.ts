import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import {Employees} from './employee.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Employees])],
  providers: [EmployeeService],
  controllers: [EmployeeController]
})
export class EmployeeModule {}
