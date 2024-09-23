import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class CommonService {
  formatDate(date: Date | number, formatString: string): string {
    return moment(date).tz('Asia/Bangkok').format(formatString);
  }

  getYesterday(formatString: string): string {
    return moment().tz('Asia/Bangkok').subtract(1, 'days').format(formatString);
  }
}
