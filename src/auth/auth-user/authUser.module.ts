import { Module } from '@nestjs/common';
import { AuthUserController } from './authUser.controller';
import { AuthUserService } from './authUser.service';
import { UserService } from 'src/modules/user/user.service';
import { JwtModule } from '@nestjs/jwt';
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
  controllers: [AuthUserController],
  providers: [AuthUserService, UserService, PrismaService],
})
export class AuthUserModule {}