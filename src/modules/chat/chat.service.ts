// src/modules/chat/chat.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

// Tipo intermediário que representa as informações mínimas de um chat para a lista
type ChatPreview = {
  id: string;              // id da última mensagem (usamos como key)
  receiverId: string;      // id do “outro lado” (user ou freela)
  userName: string;        // nome desse outro
  profile_picture?: string | null;
};

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma mensagem. Use apenas um par válido:
   *  - Usuário→Freelancer:    senderUserId + receiverFreelaId
   *  - Freelancer→Usuário:    senderFreelaId + receiverUserId
   */
  async createMessage(data: {
    content: string;
    senderUserId?: string;
    senderFreelaId?: string;
    receiverUserId?: string;
    receiverFreelaId?: string;
  }) {
    const isUserToFreela =
      Boolean(data.senderUserId) && Boolean(data.receiverFreelaId);
    const isFreelaToUser =
      Boolean(data.senderFreelaId) && Boolean(data.receiverUserId);

    if (!(isUserToFreela || isFreelaToUser)) {
      throw new BadRequestException(
        'createMessage: preencha senderUserId + receiverFreelaId ou senderFreelaId + receiverUserId',
      );
    }

    return await this.prisma.message.create({
      data: {
        content: data.content,
        senderUserId: data.senderUserId,
        senderFreelaId: data.senderFreelaId,
        receiverUserId: data.receiverUserId,
        receiverFreelaId: data.receiverFreelaId,
      },
    });
  }

  /**
   * Retorna o histórico de mensagens entre um usuário e um freelancer,
   * ordenado por createdAt ascendente.
   *
   * - userId:   id do usuário
   * - freelaId: id do freelancer
   */
  async getMessagesBetween(userId: string, freelaId: string) {
    return await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderUserId: userId,
            receiverFreelaId: freelaId,
          },
          {
            senderFreelaId: freelaId,
            receiverUserId: userId,
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Lista as conversas de um “usuário” ou de um “freelancer”.
   *
   * Se listForUser = true:
   *   - o cliente logado é do tipo “User”
   *   - busca mensagens onde senderUserId = userId OU receiverUserId = userId
   *   - agrupa cada conversa pelo Freelancer do outro lado
   *
   * Se listForUser = false:
   *   - o cliente logado é do tipo “Freelancer”
   *   - busca mensagens onde senderFreelaId = userId OU receiverFreelaId = userId
   *   - agrupa cada conversa pelo User do outro lado
   *
   * Retorna um array de objetos { id, receiverId, userName, profile_picture }.
   */
  async getUserChats(userId: string, listForUser: boolean = true) {
    if (listForUser) {
      // 1) O logado é um USER: buscamos trocas com FREELANCER
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderUserId: userId },
            { receiverUserId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          senderFreela: true,
          receiverFreela: true,
        },
      });

      // 2) Montamos um Map<freelaId, ChatPreview>
      const map = new Map<string, ChatPreview>();

      for (const msg of messages) {
        // Se o usuário enviou, quem está do outro lado é receiverFreela
        // Senão, quem está do outro lado é senderFreela
        const other = msg.senderUserId === userId
          ? msg.receiverFreela
          : msg.senderFreela;

        if (!other) {
          // Caso alguma mensagem esteja inconsistente, pulamos
          continue;
        }

        const preview: ChatPreview = {
          id: msg.id,
          receiverId: other.id,
          userName: other.name,
          profile_picture: other.profile_picture,
        };

        // Se ainda não existia esse freela no map, adicionamos
        if (!map.has(other.id)) {
          map.set(other.id, preview);
        }
        // Se já existia, ignoramos porque já teremos a mensagem mais recente (ordenamos por createdAt desc)
      }

      return Array.from(map.values());
    } else {
      // 1) O logado é um FREELANCER: buscamos trocas com USUÁRIO
      const freelaId = userId;
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderFreelaId: freelaId },
            { receiverFreelaId: freelaId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          senderUser: true,
          receiverUser: true,
        },
      });

      // 2) Montamos um Map<userId, ChatPreview>
      const map = new Map<string, ChatPreview>();

      for (const msg of messages) {
        // Se o freelancer enviou, quem está do outro lado é receiverUser
        // Senão, quem está do outro lado é senderUser
        const other = msg.senderFreelaId === freelaId
          ? msg.receiverUser
          : msg.senderUser;

        if (!other) {
          continue;
        }

        const preview: ChatPreview = {
          id: msg.id,
          receiverId: other.id,
          userName: other.name,
          profile_picture: other.profile_picture,
        };

        if (!map.has(other.id)) {
          map.set(other.id, preview);
        }
      }

      return Array.from(map.values());
    }
  }
}
