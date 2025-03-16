import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreelancerDto: UpdateFreelancerDto) {
    return this.freelancersService.update(+id, updateFreelancerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancersService.remove(+id);
  }
}
