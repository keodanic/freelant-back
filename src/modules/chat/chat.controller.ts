import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':senderId/:receiverId')
  getMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatService.getMessagesBetween(senderId, receiverId);
  }

  @Get('list')
  getChats(@Query('userId') userId: string) {
    return this.chatService.getUserChats(userId);
  }
}
