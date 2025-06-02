import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-services.dto';
import { UpdateServiceDto } from './dto/update-services.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

 
  async create(dto: CreateServiceDto) {
    
    const userExists = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
    });
    if (!userExists) {
      throw new NotFoundException('Usuário (cliente) não encontrado.');
    }

    const freelaExists = await this.prisma.freelancer.findUnique({
      where: { id: dto.freelancer_id },
    });
    if (!freelaExists) {
      throw new NotFoundException('Freelancer não encontrado.');
    }

    
    const newService = await this.prisma.service.create({
      data: {
        user_id: dto.user_id,
        freelancer_id: dto.freelancer_id,
        status: 'PENDING', 
      },
    });

    return newService;
  }

  
  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        freelancer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  
  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        freelancer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }
    return service;
  }

 
  async update(id: string, dto: UpdateServiceDto) {
    
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    
    const updated = await this.prisma.service.update({
      where: { id },
      data: {
        status: dto.status ?? existing.status,
       
      },
    });

    return updated;
  }

  
  async markAsConfirmed(id: string) {
   
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    
    if (existing.status !== ServiceStatus.PENDING) {
      throw new BadRequestException(
        'Somente serviços com status PENDING podem ser confirmados.',
      );
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: { status: ServiceStatus.CONFIRMED },
    });

    return updated;
  }

  
  async markAsCompleted(id: string) {
   
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    
    if (existing.status !== ServiceStatus.CONFIRMED) {
      throw new BadRequestException(
        'Somente serviços com status CONFIRMED podem ser marcados como COMPLETED.',
      );
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: { status: ServiceStatus.COMPLETED },
    });

    return updated;
  }

  
  async remove(id: string) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    await this.prisma.service.delete({ where: { id } });
    return { message: 'Serviço deletado com sucesso.' };
  }
}
