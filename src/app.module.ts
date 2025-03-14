import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './gateway/web-socket.gateway';
import { WhiteboardModule } from './modules/whiteboard.module';

@Module({
  imports: [WhiteboardModule],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
