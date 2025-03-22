import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto,UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request, Response } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}


  async create(body: CreateUserDto) {
    const checkEmail=await this.prisma.user.findUnique({
      where:{
        email:body.email,
      }
    });
    if(checkEmail)
      throw new HttpException('Email já existente',HttpStatus.BAD_REQUEST)

    if (body.role === 'ADMIN') {
      throw new HttpException('Não pode ser admin', HttpStatus.FORBIDDEN);
    }

    const randomsalt=randomInt(10,16);
    const hashpassword = await bcrypt.hash(body.password, randomsalt);

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: hashpassword,
        name: body.name,
        address:body.address,
        date_birth:body.date_birth,
        phone_number:body.phone_number

      },
    });

    return user;
  }

  async findById(email: string) {
    const isEmail = email.includes('@');

    if (!isEmail)
      throw new HttpException(
        `E-mail invalido, verifique-o e tente novamente!`,
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select:{
        id: true,
        name:true,
        email: true,
        password: true,
        role: true
      }
    });

    if (!user)
      throw new HttpException(`E-mail não cadastrado!`, HttpStatus.NOT_FOUND);

    return user;
  }

  async findAll() {
  
    const users=await this.prisma.user.findMany({ 

      select: {
        id: true,
        email: true,
        name: true,
        address:true,
        createdAt: true,
        updatedAt:true
      },
      orderBy: { id: 'desc' },
    })
    if (!users){
      throw new HttpException('Erro ao listar usuários',HttpStatus.BAD_REQUEST);
    }
    return users
  }

  async findOne(req: Request,) {
    if (!req.user) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

   const user= await this.prisma.user.findUnique({
    where:{id: req.user.id},
    select:{
      id: true,
      email: true,
      password:true,
      name: true,
      createdAt: true
    }
   })

   if (!user)
    throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
  } 

  async update(userId: Request, body: UpdateUserDto) {
    const id = userId.params.id;

    const findUser = await this.prisma.user.findUnique({ where: {id} });

    if (!findUser){
      console.log(id)
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

     const RandomSalt = randomInt(10, 16);
    const hashPassword = await bcrypt.hash(body.password, RandomSalt);

    const updateUser = await this.prisma.user.update({
      where: {id},
      data: {
        name: body.name,
        password: hashPassword,
        address:body.address,
        phone_number:body.phone_number,
        
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        address:true,
        phone_number:true,
        
      },
    });

    return updateUser;
  }

  async remove(id: string) {
    const findUser = await this.prisma.user.findUnique({ where: { id } });

    if (!findUser)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    await this.prisma.user.delete({ where: { id } });

    return {
      message: 'Usuário deletado com sucesso',
      status: HttpStatus.NO_CONTENT,
    };
  }
}
