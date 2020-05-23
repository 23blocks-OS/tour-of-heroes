
export class CompanyDetail {
	id: number;
  uniqueId: string;

  addressLine1: string;
  addressLine2: string;
  cityName: string;
  stateName: string;
  countryName: string;
  zipcode: string;
  phoneNumber: string;
  companyUniqueId: string;

	clear(): void {
		this.id = undefined;
	}
}
