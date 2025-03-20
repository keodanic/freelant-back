import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreelancersModule } from './freelancers/freelancers.module';
import { WorkModule } from './work/work.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [FreelancersModule, WorkModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
