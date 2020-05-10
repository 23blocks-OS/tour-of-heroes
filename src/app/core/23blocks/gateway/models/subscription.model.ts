
export class Subscription {
	id: number;
	code: string;
	uniqueId: string;
	programCode: string;
	recurringPaymentFees: number;
	recurringPaymentAmount: number;
	subscriptionNumber: string;
	subscribedAt: Date;
	closedAt: Date;
	lastPaymentAt: Date;
	nextPaymentAt: Date;
	lastPayment: number;
	paymentsMade: number;
	status: string;
	bankruptcy: boolean;

	clear(): void {
		this.id = undefined;
	}
}


