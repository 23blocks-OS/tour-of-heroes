
export class ExchangeSetting {
	id: number;
  uniqueId: string;
  vhost: string;
  host: string;
  userName: number;
  password: number;

	clear(): void {
		this.id = undefined;
	}
}
