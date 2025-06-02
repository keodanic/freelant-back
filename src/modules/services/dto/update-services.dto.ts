import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ServiceStatus } from '@prisma/client';

export class UpdateServiceDto {
  @IsOptional()
  @IsEnum(ServiceStatus, { message: 'Status inválido.' })
  status?: ServiceStatus;

}
