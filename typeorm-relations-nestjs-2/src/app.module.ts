import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity'
import { Employees } from './employee/employee.entity';
import { contactInfoEntity } from './contactInfo/contactInfo.entity';
import { meetingEntity } from './meetings/meetings.entity';
import { taskInfoEntity } from './tasks/task.entity';

@Module({
  imports: [

    UserModule,
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'rdb.sqlite',
      entities:['**/*.entity.js'],
      synchronize:true,
      logging:true
    }),
    TypeOrmModule.forFeature([Employees ,contactInfoEntity ,meetingEntity,taskInfoEntity])
    ,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
