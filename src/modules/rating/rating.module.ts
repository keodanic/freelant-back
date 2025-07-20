import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { FreelancersModule } from 'src/modules/freelancers/freelancers.module';

@Module({
  imports: [PrismaModule,FreelancersModule],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
