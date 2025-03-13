import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhiteboardService {
	private readonly API_URL_UUID = 'https://api.netless.link/v5/rooms';
	private readonly API_URL_ROOM_TOKEN = 'https://api.netless.link/v5/tokens/rooms';
	private readonly SDK_TOKEN = 'NETLESSSDK_YWs9bHZEckhXR0x6U2VtQnZVSiZub25jZT0yOGU1MzQ1MC0wMDBkLTExZjAtOTc0NC02OTNkMTliYTBmNWYmcm9sZT0wJnNpZz1mMjE3ZDE5YjI3ODJlNTZjZTRiOWI3MGVmMDI0MmQ0N2MzNmJkZDM0ODhhMTJmOWZiMjY5ZWJlYjI5ZWRiNDUy';
	private readonly REGION = 'eu';

	constructor(private readonly httpService: HttpService) {}

	/** Создаёт комнату и сразу получает Room Token */
	async createRoom(): Promise<{ roomUuid: string; roomToken: string }> {
		try {
			console.log('📡 Создаём новую комнату...');

			const headers = {
				token: this.SDK_TOKEN,
				region: this.REGION,
				'Content-Type': 'application/json',
			};

			const body = { isRecord: false };

			const response = await firstValueFrom(
				this.httpService.post(this.API_URL_UUID, body, { headers }),
			);

			const roomUuid = response.data.uuid;
			console.log('✅ Комната создана, UUID:', roomUuid);

			// Получаем токен
			const roomToken = await this.generateRoomToken(roomUuid, 'admin');
			console.log('✅ Room Token успешно получен:', roomToken);

			// Теперь точно возвращаем оба значения
			return { roomUuid, roomToken };
		} catch (error) {
			console.error('❌ Ошибка при создании комнаты:', error.response?.data || error.message);
			throw new HttpException('Не удалось создать комнату', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/** Генерирует Room Token */
	async generateRoomToken(roomUuid: string, role: 'admin' | 'writer' | 'reader', lifespan: number = 3600): Promise<string> {
		try {
			const headers = {
				token: this.SDK_TOKEN,
				region: this.REGION,
				'Content-Type': 'application/json',
			};

			const body = {
				lifespan, 
				role, 
			};

			const response = await firstValueFrom(
				this.httpService.post(`${this.API_URL_ROOM_TOKEN}/${roomUuid}`, body, { headers }),
			);
			console.log('✅ Room Token успешно получен в generatetoken:', response.data);
			return response.data;
		} catch (error) {
			console.error('❌ Ошибка при генерации Room Token:', error.response?.data || error.message);
			throw new HttpException('Не удалось создать Room Token', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

