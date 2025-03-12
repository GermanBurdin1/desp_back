import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`🔌 User connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ User disconnected: ${client.id}`);
    this.users.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    console.log(`✅ User registered: ${userId} -> ${client.id}`);
    this.users.set(userId, client.id);
  }

  @SubscribeMessage('call_invite')
  handleCallInvite(@MessageBody() data: { from: string; to: string }) {
    const targetSocketId = this.users.get(data.to);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('call_invite', { from: data.from });
      console.log(`📞 Call invite from ${data.from} to ${data.to}`);
    }
  }

  @SubscribeMessage('call_accept')
  handleCallAccept(@MessageBody() data: { from: string; to: string }) {
    const targetSocketId = this.users.get(data.to);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('call_accept', { from: data.from });
      console.log(`✅ Call accepted by ${data.from}`);
    }
  }

  @SubscribeMessage('call_reject')
  handleCallReject(@MessageBody() data: { from: string; to: string }) {
    const targetSocketId = this.users.get(data.to);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('call_reject', { from: data.from });
      console.log(`❌ Call rejected by ${data.from}`);
    }
  }
}
