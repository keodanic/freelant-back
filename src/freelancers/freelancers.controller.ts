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
  Patch
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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.freelancersService.findAll(paginationDto);
  }

  @Get()
  findOne(@Req() freelancerId: Request) {
    return this.freelancersService.findOne(freelancerId);
  }

  @Put(':id')
  update(@Req() freelancerId: Request, @Body() updateFreelancerDto: UpdateFreelancerDto) {
    return this.freelancersService.update(freelancerId, updateFreelancerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancersService.remove(id);
  }
}
