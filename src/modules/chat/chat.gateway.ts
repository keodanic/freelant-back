// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Desconectado: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    body: {
      content: string;
      senderId: string;
      receiverId: string;
      senderIsFreela: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { content, senderId, receiverId, senderIsFreela } = body;

    let saved;
    if (senderIsFreela) {
      saved = await this.chatService.createMessage({
        content,
        senderFreelaId: senderId,
        receiverUserId: receiverId,
      });
    } else {
      saved = await this.chatService.createMessage({
        content,
        senderUserId: senderId,
        receiverFreelaId: receiverId,
      });
    }

    // 1) Emite para quem enviou: client.emit
    client.emit('receive_message', saved);
    // 2) Emite para todos os outros: broadcast.emit
    client.broadcast.emit('receive_message', saved);

    return saved;
  }
}
