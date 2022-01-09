"use strict";

import {Repository} from "typeorm";
import {EntityRepository} from "typeorm/decorator/EntityRepository";
import {contactInfoEntity} from './contactInfo.entity';

@EntityRepository(contactInfoEntity)
export class ContactInfoRepository extends Repository<contactInfoEntity> {
}
