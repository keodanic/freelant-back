import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { PrismaModule } from 'src/database/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [FreelancersController],
  providers: [FreelancersService],
})
export class FreelancersModule {}
