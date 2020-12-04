export class SubscriptionModel {
  id: number;
  code: string;
  contentLink: string;
  description: string;
  duration: number;
  durationUnit: number;
  durationDescription?: string;
  endAt: Date;
  isChannel: boolean;
  maxTenants: number;
  payload: string;
  programCode: string;
  promotional: string;
  recurringPaymentFees: number;
  recurringPaymentAmount: number;
  startAt: Date;
  status: string;
  uniqueId: string;

  clear?(): void {
    this.id = undefined;
  }
}
