import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class UserSettings {
  @Property({ default: false })
  isSendNews: boolean;
  @Property({ default: false })
  isSendNewBets: boolean;
  @Property({ default: false })
  isSendNewCompetitorBets: boolean;
}
