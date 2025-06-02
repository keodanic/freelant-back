import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo rating e comentário, desde que o service esteja COMPLETED.
   */
  async createRating(dto: CreateRatingDto) {
    // Verifica se o serviço existe e está COMPLETED
    const service = await this.prisma.service.findUnique({
      where: { id: dto.service_id },
      select: {
        id: true,
        status: true,
        freelancer_id: true,
        user_id: true,
      },
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }
    if (service.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Só é possível avaliar serviços concluídos.',
      );
    }

    // Impede que o mesmo usuário avalie o mesmo serviço mais de uma vez
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        service_id: dto.service_id,
        user_id: dto.user_id,
      },
    });
    if (existingRating) {
      throw new BadRequestException('Você já avaliou este serviço.');
    }

    // Cria o Rating
    const createdRating = await this.prisma.rating.create({
      data: {
        user_id: dto.user_id,
        service_id: dto.service_id,
        rating: dto.rating,
      },
    });

    // Cria o comentário vinculado ao mesmo service
    await this.prisma.comments.create({
      data: {
        user_id: dto.user_id,
        service_id: dto.service_id,
        comment: dto.comment.trim(),
      },
    });

    return createdRating;
  }

  /**
   * Retorna todos os ratings de um freelancer, incluindo nome do usuário e comentário.
   */
  async getRatingsByFreelancer(freelancerId: string) {
    // Verifica se o freelancer existe
    const freela = await this.prisma.freelancer.findUnique({
      where: { id: freelancerId },
    });
    if (!freela) {
      throw new NotFoundException('Freelancer não encontrado.');
    }

    // Busca todos os ratings cujo serviço pertence a esse freelancer e serviço esteja COMPLETED
    const ratings = await this.prisma.rating.findMany({
      where: {
        service: {
          freelancer_id: freelancerId,
          status: 'COMPLETED',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
          },
        },
        service: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Também traz os comentários correspondentes (por relação serviço → comments → usuario)
    // Mas como a entidade Comments está separada, podemos buscá-los junto:
    const fullList = await Promise.all(
      ratings.map(async (r) => {
        const comment = await this.prisma.comments.findFirst({
          where: {
            service_id: r.service_id,
            user_id: r.user_id,
          },
          select: {
            comment: true,
            createdAt: true,
          },
        });

        return {
          id: r.id,
          rating: r.rating,
          user: {
            id: r.user.id,
            name: r.user.name,
            profile_picture: r.user.profile_picture,
          },
          service_id: r.service_id,
          comment: comment?.comment ?? '',
          commentedAt: comment?.createdAt,
          createdAt: r.createdAt,
        };
      }),
    );

    return fullList;
  }
}
