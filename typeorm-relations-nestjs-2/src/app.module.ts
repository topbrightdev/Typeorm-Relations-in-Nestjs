import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'rdb.sqlite',
      entities:[User],
      synchronize:true,
      logging:true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
