import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/\/start/, (msg) => {
      this.sendMessage(msg.chat.id, 'Welcome to the bot!');
    });
  }

  async sendMessage(chatId: number, message: string) {
    return this.bot.sendMessage(chatId, message);
  }
}
