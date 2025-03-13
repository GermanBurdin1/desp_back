import { Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { WhiteboardService } from '../services/whiteboard/whiteboard.service';

@Controller('whiteboard')
export class WhiteboardController {
	constructor(private readonly whiteboardService: WhiteboardService) {}

	/** Один запрос = создаёт комнату и сразу возвращает roomUuid + roomToken */
	@Post('create-room')
	async createRoomWithToken() {
		try {
			const result = await this.whiteboardService.createRoom();
			return result;
		} catch (error) {
			console.error('❌ Ошибка при создании комнаты и токена:', error);
			throw new HttpException('Ошибка при создании комнаты и токена', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/** Отдельный запрос для получения токена по UUID */
	@Get('get-room-token')
	async getRoomToken(
		@Query('roomUuid') roomUuid: string,
		@Query('role') role: 'admin' | 'writer' | 'reader',
		@Query('lifespan') lifespan?: number,
	) {
		if (!roomUuid || !role) {
			return { error: 'roomUuid и role обязательны' };
		}
		const token = await this.whiteboardService.generateRoomToken(roomUuid, role, lifespan);
		return { roomToken: token };
	}
}
