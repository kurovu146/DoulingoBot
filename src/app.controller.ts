import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) {}

  @Get()
  async PushNotiTele(): Promise<string> {
    return await this.appService.NotiExp();
  }

  @Post()
  async createUser() {
    const users = ["Kuro146", "longvuit18", "thangthuy9900", "tunali0907"]
    const result = []
    for (const user of users) {
      const data = await this.GetID(user)
      const m_user = {user_id: String(data.id), username: data.username, pre_exp: data.totalXp}
      result.push(m_user)
    }
    console.log('data: ', result);
    
    return this.prisma.user.createMany({data: result});
  }

  async GetID(username) {
    try {
      const response = await axios.get(`https://www.duolingo.com/2017-06-30/users?username=${username}`, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'User-Agent': 'Mozilla/5.0 (compatible; DuolingoStreakChecker/1.0)'
        }
      });
      return response.data.users[0];
    } catch (error) {
      console.error('Error getID:', error);
      return null;
    }
  }
}
