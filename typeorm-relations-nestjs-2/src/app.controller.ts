import { Controller, Get ,Post ,Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Employees } from './employee/employee.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Post('/signup')
  // async createUser(@Body() body: Employees ) {
  //   const user = await this.appService.create(body);
  //   return user;
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
