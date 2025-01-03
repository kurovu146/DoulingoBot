import { Injectable, Logger, LoggerService } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class DoulingoService {
  private readonly logger: LoggerService = new Logger(DoulingoService.name, { timestamp: true });

  async GetID(username: string) {
    try {
      const response = await axios.get(`https://www.duolingo.com/2017-06-30/users?username=${username}`, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'User-Agent': 'Mozilla/5.0 (compatible; DuolingoStreakChecker/1.0)'
        }
      });
      this.logger.log('Get user data successfully!');

      return response.data.users[0];
    } catch (error) {
      this.logger.log('Error getID:', error);

      return null;
    }
  }

  async GetExpToday(userID) {
    try {
      const response = await axios.get(`https://www.duolingo.com/2017-06-30/users/${userID}/xp_summaries`, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'User-Agent': 'Mozilla/5.0 (compatible; DuolingoStreakChecker/1.0)'
        }
      });
      this.logger.log('Get exp data successfully!');

      return response.data?.summaries.slice(0, 2);
    } catch (error) {
      this.logger.log('Error exp:', error);

      return null;
    }
  }

  async GetExpWeekly(userID) {
    try {
      const response = await axios.get(`https://www.duolingo.com/2017-06-30/users/${userID}/xp_summaries`, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'User-Agent': 'Mozilla/5.0 (compatible; DuolingoStreakChecker/1.0)'
        }
      });
      this.logger.log('Get exp data successfully!');

      return response.data?.summaries;
    } catch (error) {
      this.logger.log('Error exp:', error);

      return null;
    }
  }
}