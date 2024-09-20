import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import { TelegramService } from './telegram/telegram.service';

@Injectable()
export class AppService {

  constructor(
    private prisma: PrismaService,
    private telegram: TelegramService
  ) {}
  
  async NotiExp() {
    const users = await this.prisma.user.findMany();
    let msg_exp = `Thống kê ngày ${new Date()}`;
    let msg_debt = ""

    for (const user of users) {
      const data = await this.GetExpToday(user.user_id);
      const currentExp = data?.totalXp;

      if (currentExp < user.pre_exp + 500) {
        msg_exp += `${user.username} còn thiếu ${user.pre_exp + 500 - currentExp} exp!\n`;
      } else {
        msg_exp += `${user.username} đã suất sắc hoàn thành mục tiêu ngày hôm nay với ${currentExp - user.pre_exp} exp!\n`;
      }

      msg_debt += `${user.username} đang có dư nợ ${user.debt}.000VND!\n`;
      await this.UpdateExp(user, currentExp);
    }

    // this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_exp);
    // this.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), msg_debt);
    console.log(msg_exp);
    console.log(msg_debt);
    
    return 'Hello World!';
  }

  async GetExpToday(userID) {
    try {
      const response = await axios.get(`https://www.duolingo.com/2017-06-30/users/${userID}`, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'User-Agent': 'Mozilla/5.0 (compatible; DuolingoStreakChecker/1.0)'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getID:', error);
      return null;
    }
  }

  async UpdateExp(user, currentExp) { 
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        pre_exp: currentExp
      }
    })
  }
}
