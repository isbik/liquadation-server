import { IsDefined } from 'class-validator';

export class UpdateNotificationDto {
  @IsDefined()
  isSendNews: boolean;
  @IsDefined()
  isSendNewBets: boolean;
  @IsDefined()
  isSendNewCompetitorBets: boolean;
}
