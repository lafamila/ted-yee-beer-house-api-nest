import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TravelModule } from './travel/travel.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TodoModule, TravelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
