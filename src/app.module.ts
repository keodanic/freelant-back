import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FreelancersModule } from './modules/freelancers/freelancers.module';
import { WorkModule } from './modules/work/work.module';
import { UserModule } from './modules/user/user.module';
import { AuthUserController } from './auth/auth-user/authUser.controller';
import { AuthUserService } from './auth/auth-user/authUser.service';
import { AuthUserModule } from './auth/auth-user/authUser.module';
import { UserService } from './modules/user/user.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [FreelancersModule, WorkModule, UserModule, AuthUserModule],
  controllers: [AppController, AuthUserController],
  providers: [AppService, AuthUserService,UserService,PrismaService],
})
export class AppModule {}
