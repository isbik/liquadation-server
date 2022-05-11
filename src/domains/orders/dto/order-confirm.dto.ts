export class OrderConfirmDto {
  externalId: string;
  status: {
    name:
      | 'PaymentCreated'
      | 'PaymentTransactionCreated'
      | 'PaymentPaid'
      | 'PaymentFailed'
      | 'PaymentRefunded'
      | 'PaymentPreAuthorized'
      | 'PaymentCancelled';
    time: string;
    message: string;
  };
}
