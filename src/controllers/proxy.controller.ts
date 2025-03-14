import { Controller, Req, Res, All } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All('whiteboard')
  async proxyWhiteboard(@Req() req, @Res() res) {
    const url = 'https://event.whiteboard.sd-rtn.com/';
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,    // Проксируемый HTTP-метод
          url: url,              // Проксируемый URL
          headers: req.headers,  // Передаём заголовки (например, токен)
          data: req.body,        // Если есть тело запроса (например, POST)
        })
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Ошибка проксирования' });
    }
  }
}
