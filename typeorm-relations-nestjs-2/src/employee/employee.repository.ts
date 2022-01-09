"use strict";

import {Repository} from "typeorm";
import {EntityRepository} from "typeorm/decorator/EntityRepository";
import {Employees} from './employee.entity';

@EntityRepository(Employees)
export class EmployeesRepository extends Repository<Employees> {
}
