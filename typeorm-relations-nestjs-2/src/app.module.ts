import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity'
import { EmployeeModule } from './employee/employee.module';

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
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
