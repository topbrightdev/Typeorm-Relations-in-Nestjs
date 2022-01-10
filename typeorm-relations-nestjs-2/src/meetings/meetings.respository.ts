"use strict";

import {Repository} from "typeorm";
import {EntityRepository} from "typeorm/decorator/EntityRepository";
import {meetingEntity} from './meetings.entity';

@EntityRepository(meetingEntity)
export class TaskInfoRepository extends Repository<meetingEntity> {
}
