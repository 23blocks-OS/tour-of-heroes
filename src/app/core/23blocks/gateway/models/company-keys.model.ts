
export class CompanyKeys {
	id: number;
  uniqueId: string;

  description: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
  apiRegion: string;

	clear(): void {
		this.id = undefined;
	}
}
