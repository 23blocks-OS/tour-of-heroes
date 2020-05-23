
export class Profile {
	id: number;
	uniqueId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  ethnicity: string;
  zipcode: string;
  maritalStatus: string;
  birthdate: string;
  hhi: string;
  children: string;
  source: string;
	status: string;

	clear(): void {
		this.id = undefined;
	}
}
