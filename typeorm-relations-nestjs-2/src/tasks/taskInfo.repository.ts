"use strict";

import {Repository} from "typeorm";
import {EntityRepository} from "typeorm/decorator/EntityRepository";
import {taskInfoEntity} from './task.entity';

@EntityRepository(taskInfoEntity)
export class TaskInfoRepository extends Repository<taskInfoEntity> {
}
