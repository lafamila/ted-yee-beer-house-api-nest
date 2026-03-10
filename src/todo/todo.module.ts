import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MemoGateway } from './memo.gateway';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('TODO_API_BASE_URL'),
        timeout: 10_000,
      }),
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService, MemoGateway],
})
export class TodoModule {}
