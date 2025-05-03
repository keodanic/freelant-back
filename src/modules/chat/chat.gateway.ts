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
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService) {}
  
    handleConnection(client: Socket) {
      console.log(`Conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Desconectado: ${client.id}`);
    }
  
    @SubscribeMessage('send_message')
    async handleSendMessage(
      @MessageBody() body: { senderId: string; receiverId: string; content: string },
      @ConnectedSocket() client: Socket,
    ) {
      const saved = await this.chatService.createMessage(body);
      client.broadcast.emit('receive_message', saved);
      return saved;
    }
  }
  