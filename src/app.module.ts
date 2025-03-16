import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreelancersModule } from './freelancers/freelancers.module';

@Module({
  imports: [FreelancersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
