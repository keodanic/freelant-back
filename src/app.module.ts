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
import { AuthFreelaController } from './auth/auth-freela/authFreela.controller';
import { AuthFreelaService } from './auth/auth-freela/authFreela.service';
import { FreelancersService } from './modules/freelancers/freelancers.service';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [FreelancersModule, WorkModule, UserModule, AuthUserModule, ChatModule],
  controllers: [AppController, AuthUserController,AuthFreelaController],
  providers: [AppService, AuthUserService,UserService,AuthFreelaService, FreelancersService,PrismaService],
})
export class AppModule {}
