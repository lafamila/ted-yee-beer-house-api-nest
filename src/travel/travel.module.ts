import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('TRAVEL_API_BASE_URL'),
        timeout: 10_000,
      }),
    }),
  ],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
