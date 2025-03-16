import { Injectable } from '@nestjs/common';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';

@Injectable()
export class FreelancersService {
  create(createFreelancerDto: CreateFreelancerDto) {
    return 'This action adds a new freelancer';
  }

  findAll() {
    return `This action returns all freelancers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freelancer`;
  }

  update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    return `This action updates a #${id} freelancer`;
  }

  remove(id: number) {
    return `This action removes a #${id} freelancer`;
  }
}
