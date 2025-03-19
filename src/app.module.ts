import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreelancersModule } from './freelancers/freelancers.module';
import { WorkModule } from './work/work.module';

@Module({
  imports: [FreelancersModule, WorkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
