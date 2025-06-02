import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAllbyWork(workId?: string) {
    let freelancers;
    if (workId) {
      freelancers = await this.prisma.freelancer.findMany({
        where: {
          work_id: workId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          workCategory: true,
          profile_picture: true,
          // se quiser incluir ratings/avg, inclua aqui
        },
        orderBy: { id: 'desc' },
      });
    } else {
      freelancers = await this.prisma.freelancer.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          workCategory: true,
          profile_picture: true,
        },
        orderBy: { id: 'desc' },
      });
    }

    if (!freelancers) {
      throw new HttpException('Erro ao listar freelancers', HttpStatus.BAD_REQUEST);
    }
    return freelancers;
  }

  async findAll() {
  
    const freelancers=await this.prisma.freelancer.findMany({ 

      select: {
        id: true,
        email: true,
        name: true,
        workCategory:true,
        createdAt: true
      },
      orderBy: { id: 'desc' },
    })
    if (!freelancers){
      throw new HttpException('Erro ao listar usuários',HttpStatus.BAD_REQUEST);
    }
    return freelancers
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

    const findFreelancer = await this.prisma.freelancer.findUnique({ where: {id} });

    if (!findFreelancer){
      console.log(id)
      throw new HttpException('Freelancer não encontrado', HttpStatus.NOT_FOUND);
    }

     const RandomSalt = randomInt(10, 16);
    const hashPassword = await bcrypt.hash(body.password, RandomSalt);

    const updateFreelancer = await this.prisma.freelancer.update({
      where: {id},
      data: {
        name: body.name,
        password: hashPassword,
        address:body.address,
        phone_number:body.phone_number,
        link_portfolio:body.link_portfolio,
        profile_picture: body.profile_picture
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

  async findServicesByFreelancer(freelancerId: string) {
    // 1) Verifica se o freelancer existe
    const freela = await this.prisma.freelancer.findUnique({
      where: { id: freelancerId },
    });
    if (!freela) {
      throw new NotFoundException("Freelancer não encontrado.");
    }

    // 2) Busca todos os serviços que tenham esse freelancer_id,
    //    e inclui informações do usuário (cliente).
    const services = await this.prisma.service.findMany({
      where: {
        freelancer_id: freelancerId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 3) Normaliza para retornar apenas o que o front precisa:
    //    { id: string, clientId: string, clientName: string, status: ServiceStatus }
    const result = services.map((s) => ({
      id: s.id,
      clientId: s.user.id,
      clientName: s.user.name,
      status: s.status,
    }));

    return result;
  }

  async getProfile(id: string) {
    // 1) Buscamos o freelancer e todas as relações necessárias:
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profile_picture: true,
        work_id: true,
        workCategory: {
          select: { name: true },
        },
        link_portfolio: true,
        phone_number: true,
        // Trazemos os serviços com comentários (incluindo o usuário que comentou)
        services: {
          select: {
            comments: {
              select: {
                comment: true,
                createdAt: true,
                // Aqui incluímos o usuário que fez o comentário
                user: {
                  select: { name: true },
                },
              },
            },
            ratings: {
              select: {
                rating: true,
              },
            },
            status: true,
          },
        },
      },
    });

    if (!freelancer) {
      throw new NotFoundException('Freelancer não encontrado');
    }

    // 2) Calcula a média de todas as notas vindas de todos os serviços
    const allRatings = freelancer.services.flatMap((service) =>
      service.ratings.map((r) => Number(r.rating))
    );
    const average_rating =
      allRatings.length > 0
        ? allRatings.reduce((acc, cur) => acc + cur, 0) / allRatings.length
        : 0;

    // 3) Extrai e formata os comentários
    //    Cada comentário agora tem: { comment: string, user: { name: string }, createdAt }
    //    Vamos transformar em [{ author: string, comment: string }]
    const comments = freelancer.services.flatMap((service) =>
      service.comments.map((c) => ({
        author: c.user.name,
        comment: c.comment,
      }))
    );

    // 4) Contamos quantos serviços (por exemplo, COMPLETED) esse freelancer já teve.
    //    Ajuste esse filtro de status caso queira contar todos os status ou outro critério.
    const totalServices = await this.prisma.service.count({
      where: {
        freelancer_id: id,
        status: 'COMPLETED',
      },
    });

    // 5) Montamos o objeto final que será retornado ao controller
    return {
      id: freelancer.id,
      name: freelancer.name,
      profile_picture: freelancer.profile_picture,
      workCategory: freelancer.workCategory, // { name: string }
      totalServices,
      link_portfolio: freelancer.link_portfolio,
      phone_number: freelancer.phone_number,
      average_rating: Number(average_rating.toFixed(1)),
      comments, // [{ author: string, comment: string }, ...]
    };
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
