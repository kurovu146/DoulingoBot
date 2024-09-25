import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) {}

  @Get()
  async PushNotiTele(): Promise<string> {
    return 'Hello';
  }

  @Post('/exp')
  async PushNotiExp() {
    await this.appService.NotiExp();
  }

  @Post('/remind')
  async PushNotiRemind() {
    await this.appService.NotiLearning();
  }
}
