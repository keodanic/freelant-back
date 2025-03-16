import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';

@Module({
  controllers: [FreelancersController],
  providers: [FreelancersService],
})
export class FreelancersModule {}
