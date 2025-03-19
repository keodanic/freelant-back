import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}
  
  
  async create(body: CreateWorkDto) {
    const checkWork= await this.prisma.workCategory.findUnique({
      where:{
        name:body.name
      }
    })
    if(checkWork)
      throw new HttpException('Email já existente',HttpStatus.BAD_REQUEST)

    const workCategory= await this.prisma.workCategory.create({
      data:{
        name:body.name
      }
    })
    return workCategory;
  }

  async findAll() {
    const work=await this.prisma.workCategory.findMany({ 

      select: {
        id: true,
        name: true
      },
      orderBy: { id: 'desc' },
    })
    if (!work){
      throw new HttpException('Erro ao listar trabalhos',HttpStatus.BAD_REQUEST);
    }
    return work
  }

  
  async remove(id: string) {
    const findWork = await this.prisma.workCategory.findUnique({ where: { id } });

    if (!findWork)
      throw new HttpException('Trabalho não encontrado', HttpStatus.NOT_FOUND);

    await this.prisma.workCategory.delete({ where: { id } });

    return {
      message: 'Trabalho deletado com sucesso',
      status: HttpStatus.NO_CONTENT,
    };
  }
}
