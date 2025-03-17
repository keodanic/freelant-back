import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFreelancerDto,UpdateFreelancerDto } from './dto/create-freelancer.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request, Response } from 'express';

@Injectable()
export class FreelancersService {
  constructor(private readonly prisma: PrismaService) {}


  async create(body: CreateFreelancerDto) {
    const checkEmail=await this.prisma.freelancer.findUnique({
      where:{
        email:body.email,
      }
    });
    if(checkEmail)
      throw new HttpException('Email já existente',HttpStatus.BAD_REQUEST)

    const randomsalt=randomInt(10,16);
    const hashpassword = await bcrypt.hash(body.password, randomsalt);

    const freelancer = await this.prisma.freelancer.create({
      data: {
        email: body.email,
        password: hashpassword,
        name: body.name,
        address:body.address,
        date_birth:body.date_birth,
        phone_number:body.phone_number,
        link_portfolio:body.link_portfolio,
        work_id:body.work_id
        
      },
    });

    return freelancer;
  }

  async findById(email: string) {
    const isEmail = email.includes('@');

    if (!isEmail)
      throw new HttpException(
        `E-mail invalido, verifique-o e tente novamente!`,
        HttpStatus.BAD_REQUEST,
      );

    const freelancer = await this.prisma.freelancer.findUnique({
      where: {
        email,
      },
      select:{
        id: true,
        name:true,
        email: true,
        workCategory:true,
        password: true
      }
    });

    if (!freelancer)
      throw new HttpException(`E-mail não cadastrado!`, HttpStatus.NOT_FOUND);

    return freelancer;
  }

  async findAll(paginationDto:PaginationDto) {
    const {page,pageSize}= paginationDto
    const offSet= (page-1) * pageSize

    const freelancers=await this.prisma.freelancer.findMany({
      skip: offSet,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        workCategory:true,
        createdAt: true
      },
      orderBy: { id: 'desc' },
    })
    if (!freelancers)
      throw new HttpException(
        'Erro ao listar usuários',
        HttpStatus.BAD_REQUEST,
      );
  }

  async findOne(req: Request,) {
    if (!req.freelancer) {
      throw new HttpException('Freelancer não encontrado', HttpStatus.NOT_FOUND);
    }

   const freelancer= await this.prisma.freelancer.findUnique({
    where:{id: req.freelancer.id},
    select:{
      id: true,
      email: true,
      name: true,
      workCategory:true,
      createdAt: true
    }
   })

   if (!freelancer)
    throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
  } 

  async update(freelancerId: Request, body: UpdateFreelancerDto) {
    const id = freelancerId.params.id;

    const findFreelancer = await this.prisma.user.findUnique({ where: {id} });

    if (!findFreelancer)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

     const RandomSalt = randomInt(10, 16);
    const hashPassword = await bcrypt.hash(body.password, RandomSalt);

    const updateFreelancer = await this.prisma.freelancer.update({
      where: {id},
      data: {
        name: body.name,
        password: hashPassword,
        address:body.address,
        phone_number:body.phone_number,
        link_portfolio:body.link_portfolio
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        address:true,
        phone_number:true,
        link_portfolio:true
      },
    });

    return updateFreelancer;
  }

  async remove(id: string) {
    const findFreelancer = await this.prisma.freelancer.findUnique({ where: { id } });

    if (!findFreelancer)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    await this.prisma.freelancer.delete({ where: { id } });

    return {
      message: 'Usuário deletado com sucesso',
      status: HttpStatus.NO_CONTENT,
    };
  }
}
