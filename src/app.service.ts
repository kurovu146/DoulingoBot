import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TelegramService } from './telegram/telegram.service';
import { DoulingoService } from './doulingo/doulingo.service';
import { CommonService } from './common/common.service';
import { UserService } from './user/user.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
    private readonly doulingo: DoulingoService,
    private readonly common: CommonService,
    private readonly user: UserService
  ) {}
  
  async NotiExp() {
    const users = await this.prisma.user.findMany();
    const yesterday = await this.common.getYesterday(process.env.DATE_FORMAT);
    let msg_exp = `Thống kê ngày ${yesterday}\n`;
    let msg_debt = ""

    for (const user of users) {
      const data = await this.doulingo.GetExpToday(user.doulingo_id);
      const currentExp = data?.gainedXp;
      const date = await this.common.formatDate(data.date*1000, process.env.DATE_FORMAT);

      if (date == yesterday) {
        if (currentExp < 500) {
          msg_exp += `${user.username} còn thiếu ${500 - currentExp} exp!\n`;
          await this.user.Update(user.doulingo_id, {debt: user.debt + 20});
        } else {
          msg_exp += `${user.username} đã suất sắc hoàn thành mục tiêu ngày hôm nay với ${currentExp} exp!\n`;
        }
      } else {
        msg_exp += `${user.username} lười đến nỗi không học bài nào ngày hôm nay!\n`
        await this.user.Update(user.doulingo_id, {debt: user.debt + 20});
      }

      msg_debt += `${user.username} đang có dư nợ ${user.debt}.000VND!\n`;
      await this.prisma.dailyExp.create({
        data: {
          user_id: user.id,
          exp: data?.gainedXp,
          date
        }
      })
    }

    this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_exp);
    this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_debt);
    
    return 'Hello World!';
  }

  @Cron('0 10 0 * * *') // Chạy vào 12:10 AM hàng ngày
  handleCron() {
    this.NotiExp();
  }
}
