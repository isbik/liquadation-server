import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import fetch from 'cross-fetch';

@Injectable()
export class PicassoService {
  private readonly URL = 'https://pikassa.io/merchant-api/api/v2/invoices';

  async createPayment() {
    const body = {
      externalId: 'test 2',
      amount: 100_000,
      description: 'Оплата товара',
      currency: 'RUB',
      successUrl: 'https://mysite.com/successUrl',
      failUrl: 'https://mysite.com/failUrl',
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.PICASSO_API_KEY,
      'X-Sign': createHash('md5')
        .update(JSON.stringify(body) + process.env.PICASSO_SECRET_PHRASE)
        .digest('base64'),
    };

    const response = await fetch(this.URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });

    const data = await response.json();

    return data;
  }
}
