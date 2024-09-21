import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { TelegramModule } from './telegram/telegram.module';
import { UserModule } from './user/user.module';
import { DoulingoService } from './doulingo/doulingo.service';
import { CommonService } from './common/common.service';
import { UserService } from './user/user.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TelegramModule, UserModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, DoulingoService, CommonService, UserService],
})
export class AppModule {}
