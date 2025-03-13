import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhiteboardService } from '../services/whiteboard/whiteboard.service';
import { WhiteboardController } from '../controllers/whiteboard.controller';

@Module({
	imports: [HttpModule],
	providers: [WhiteboardService],
	controllers: [WhiteboardController],
})
export class WhiteboardModule { }
