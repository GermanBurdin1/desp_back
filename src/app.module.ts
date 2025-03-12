import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './gateway/web-socket.gateway';

@Module({
  imports: [],
  controllers: [AppController, WebsocketGateway],
  providers: [AppService],
})
export class AppModule {}
