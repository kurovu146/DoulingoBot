import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class CommonService {
  formatDate(date: Date | number, formatString: string): string {
    return moment(date).format(formatString);
  }

  getYesterday(formatString: string): string {
    return moment().subtract(1, 'days').format(formatString);
  }
}
