import { Module } from '@nestjs/common';
import { AuthFreelaService } from './authFreela.service';
import { AuthFreelaController } from './authFreela.controller';
import { JwtModule } from '@nestjs/jwt';
import { FreelancersService } from 'src/modules/freelancers/freelancers.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [
  
      JwtModule.registerAsync({
        global: true,
        useFactory: async () => ({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '43200s' },
        }),
      }),
    ],
  providers: [AuthFreelaService,FreelancersService,PrismaService],
  controllers: [AuthFreelaController]
})
export class AuthFreelaModule {}
