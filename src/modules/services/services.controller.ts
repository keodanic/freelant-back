import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-services.dto';
import { UpdateServiceDto } from './dto/update-services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  
  @Post()
  async create(@Body() createDto: CreateServiceDto) {
    try {
      return await this.servicesService.create(createDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

 
  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }
    return service;
  }

 
  @Patch(':id/confirm')
  async confirmService(@Param('id') id: string) {
    try {
      return await this.servicesService.markAsConfirmed(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  
  @Patch(':id/complete')
  async completeService(@Param('id') id: string) {
    try {
      return await this.servicesService.markAsCompleted(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    try {
      return await this.servicesService.update(id, updateDto);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.servicesService.remove(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
