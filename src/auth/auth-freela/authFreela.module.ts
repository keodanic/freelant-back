import { Module } from '@nestjs/common';
import { AuthFreelaService } from './authFreela.service';
import { AuthFreelaController } from './authFreela.controller';

@Module({
  providers: [AuthFreelaService],
  controllers: [AuthFreelaController]
})
export class AuthFreelaModule {}
