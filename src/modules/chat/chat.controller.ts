import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':senderId/:receiverId')
  getMessages(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
    return this.chatService.getMessagesBetween(senderId, receiverId);
  }
}
