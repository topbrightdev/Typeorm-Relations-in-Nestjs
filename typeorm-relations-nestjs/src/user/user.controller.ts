import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    Delete,
    Patch,
    Query,
    Session,
    UseInterceptors,
    NotFoundException,
    UseGuards
  } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto ) {
      return await this.userService.create(body.email, body.password);
     //console.log(body)
      
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
  
      const user = await this.userService.findOne(parseInt(id));
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    }
  



}

