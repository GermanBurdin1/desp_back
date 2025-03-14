import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhiteboardService } from '../services/whiteboard/whiteboard.service';
import { WhiteboardController } from '../controllers/whiteboard.controller';
import { ProxyController } from '../controllers/proxy.controller';

@Module({
	imports: [HttpModule],
	providers: [WhiteboardService],
	controllers: [WhiteboardController, ProxyController],
})
export class WhiteboardModule { }
