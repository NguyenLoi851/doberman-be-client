import { Controller, Get, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/.well-known/pki-validation/A754A961C7F6DB7A9A1CB83D0A387D2B.txt')
  getVerifySslFile() {
    const file = createReadStream(join(process.cwd(), 'A754A961C7F6DB7A9A1CB83D0A387D2B.txt'));
    return new StreamableFile(file);
  }
}
