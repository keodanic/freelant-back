import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  Req,
  Patch,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { CreateFreelancerDto, UpdateFreelancerDto } from './dto/create-freelancer.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request } from 'express';


@Controller('freelancers')
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Post()
  create(@Body() createFreelancerDto: CreateFreelancerDto) {
    return this.freelancersService.create(createFreelancerDto);
  }

  @Get()
  findAll() {
    return this.freelancersService.findAll(); 
  }

  @Get("work")
  findAllbyWork(@Query('workId') workId?: string) {
    return this.freelancersService.findAllbyWork(workId);
  }
  
  @Get(":id/services")
  async getServicesByFreelancer(@Param("id") freelancerId: string) {
    try {
      return await this.freelancersService.findServicesByFreelancer(freelancerId);
    } catch (err) {
      // Se freelancer não existir, devolve 404
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

 @Get('profile/:id')                     
  getProfile(@Param('id') id: string) {
    return this.freelancersService.getProfile(id);
  }

 @Put(':id')
  update(@Param('id') id: string, @Body() updateFreelancerDto: UpdateFreelancerDto) {
    return this.freelancersService.update({ params: { id } } as any, updateFreelancerDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancersService.remove(id);
  }
}
