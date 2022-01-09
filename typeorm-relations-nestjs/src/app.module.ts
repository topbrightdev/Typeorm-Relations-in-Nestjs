import { Module ,ValidationPipe} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'db.sqlite',
      entities:[User],
      synchronize:true,
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    }
  ],
})
export class AppModule {}
