import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf<Context>;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env file');
    }

    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    this.setupBotCommands();
    console.log('Telegram bot is running');
  }

  setupBotCommands() {
    this.bot.start((ctx) => {
      ctx.reply(`Welcome, ${ctx.from?.first_name || 'User'}!`);
    });

    this.bot.command('help', (ctx) => {
      ctx.reply('Available commands:\n/start - Start the bot\n/help - Show this help message');
    });
  }

  sendMessage(chatId: number | string, message: string) {
    return this.bot.telegram.sendMessage(chatId, message);
  }
}
