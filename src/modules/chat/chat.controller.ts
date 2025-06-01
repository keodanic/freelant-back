// src/modules/chat/chat.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Criação de mensagem via REST (opcional; WebSocket deve chamar createMessage diretamente)
   * Espera body: { content, senderId, receiverId, senderIsFreela }
   */
  @Post()
  async createMessageREST(@Body() body: {
    content: string;
    senderId: string;
    receiverId: string;
    senderIsFreela: boolean;
  }) {
    const { content, senderId, receiverId, senderIsFreela } = body;
    if (senderIsFreela) {
      return this.chatService.createMessage({
        content,
        senderFreelaId: senderId,
        receiverUserId: receiverId,
      });
    } else {
      return this.chatService.createMessage({
        content,
        senderUserId: senderId,
        receiverFreelaId: receiverId,
      });
    }
  }

  /**
   * GET histórico entre usuário e freelancer
   * Parametros: /chat/:userId/:freelaId
   */
  @Get(':userId/:freelaId')
  getMessagesBetween(
    @Param('userId') userId: string,
    @Param('freelaId') freelaId: string,
  ) {
    return this.chatService.getMessagesBetween(userId, freelaId);
  }

  /**
   * GET /chat/list?userId=<ID>&listForUser=<"true" ou "false">
   */
  @Get('list')
  getChats(
    @Query('userId') userId: string,
    @Query('listForUser') listForUser: string, // "true" ou "false"
  ) {
    const isUser = listForUser === 'true';
    return this.chatService.getUserChats(userId, isUser);
  }
}
