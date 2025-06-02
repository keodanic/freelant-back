import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  /**
   * POST /ratings
   * Cria uma nova avaliação (rating + comentário).
   */
  @Post()
  async create(@Body() createDto: CreateRatingDto) {
    try {
      return await this.ratingService.createRating(createDto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * GET /ratings/freelancer/:freelancerId
   * Retorna todas as avaliações de um freelancer (apenas ratings relacionados a serviços COMPLETED).
   */
  @Get('freelancer/:freelancerId')
  async findByFreelancer(@Param('freelancerId') freelancerId: string) {
    try {
      return await this.ratingService.getRatingsByFreelancer(freelancerId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
