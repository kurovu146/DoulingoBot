import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TelegramService } from './telegram/telegram.service';
import { DoulingoService } from './doulingo/doulingo.service';
import { CommonService } from './common/common.service';
import { UserService } from './user/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';

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
      const userData = data?.map(item => this.common.formatDate(item.date*1000, process.env.DATE_FORMAT) == yesterday ? item : 0).find(item => item !== 0);
      const currentExp = userData?.gainedXp;
      const date = await this.common.formatDate(userData?.date*1000, process.env.DATE_FORMAT);

      if (date == yesterday) {
        if (currentExp < 500) {
          msg_exp += `${user.username} còn thiếu ${500 - currentExp} exp!\n`;
          user.debt = user.debt + 20;
          await this.user.Update(user.doulingo_id, {debt: user.debt});
        } else {
          msg_exp += `${user.username} đã suất sắc hoàn thành mục tiêu ngày hôm nay với ${currentExp} exp\n`;
        }
      } else {
        msg_exp += `${user.username} lười đến nỗi không học bài nào ngày hôm nay!\n`
        user.debt = user.debt + 20;
        await this.user.Update(user.doulingo_id, {debt: user.debt});
      }

      msg_debt += `${user.username} đang có dư nợ ${user.debt}.000VND!\n`;
      await this.prisma.dailyExp.create({
        data: {
          user_id: user.id,
          exp: data?.gainedXp,
          date: await this.common.formatDate(new Date(), process.env.DATE_FORMAT)
        }
      })
    }

    this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_exp);
    this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_debt);
    
  }

  async NotiLearning() {
    const users = await this.prisma.user.findMany();
    const now = this.common.formatDate(new Date(), process.env.DATE_FORMAT);
    let msg_remind = `Hệ thống nhắc nhở các anh zai chú ý việc học ngày ${now}\n`;

    for (const user of users) {
      const data = await this.doulingo.GetExpToday(user.doulingo_id);
      const currentExp = data?.gainedXp;
      const date = this.common.formatDate(data.date*1000, process.env.DATE_FORMAT);
    
      if (date == now) {
        if (currentExp < 500) {
          msg_remind += `🚀 ${user.username} còn thiếu ${500 - currentExp} exp!\n\n`;
        } else {
          msg_remind += `✅ ${user.username} đã suất sắc hoàn thành mục tiêu ngày hôm nay với ${currentExp} exp\n\n`;
        }
      } else {
        msg_remind += `❌ ${user.username} lười đến nỗi không học bài nào ngày hôm nay!\n\n`
      }
    }

    this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_remind);
  }

  @Cron("0 10 0 * * *")
  async CronNotiExp() {
    console.log('CronNotiExp');
    await this.NotiExp();
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async CronNotiRemind1() {
    console.log('CronNotiRemind1');
    await this.NotiLearning();
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  // async CronNotiRemind2() {
  //   console.log('Ping');
  //   // await this.NotiLearning();
  // }
}
