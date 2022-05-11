import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import fetch from 'cross-fetch';
import { createHash } from 'crypto';

@Injectable()
export class PicassoService {
  private readonly URL = 'https://pikassa.io/merchant-api/api/v2/invoices';

  async createPayment(body: Record<string, number | string>) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.PICASSO_API_KEY,
      'X-Sign': createHash('md5')
        .update(JSON.stringify(body) + process.env.PICASSO_SECRET_PHRASE)
        .digest('base64'),
    };

    try {
      const response = await fetch(this.URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
      });

      const { data } = await response.json();

      return data;
    } catch (error) {
      throw new HttpException(
        'Не удалось создать заказ',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
