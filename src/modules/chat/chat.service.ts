import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: { senderId: string; receiverId: string; content: string }) {
    return await this.prisma.message.create({ data });
  }

  async getMessagesBetween(senderId: string, receiverId: string) {
    return await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserChats(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      distinct: ['receiverId'],
      orderBy: { createdAt: 'desc' },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // Agrupa por outro usuário, removendo duplicatas
    const chatList = Array.from(
      new Map(
        messages.map((msg) => {
          const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
          return [
            otherUser.id,
            {
              id: msg.id,
              receiverId: otherUser.id,
              userName: otherUser.name,
              profile_picture: otherUser.profile_picture,
            },
          ];
        }),
      ).values(),
    );

    return chatList;
  }
}
