export class Role {
	id: number;
	name: string;
	code: string;
	permissions: number[];

	clear(): void {
		this.id = undefined;
		this.name = '';
		this.code = '';
		this.permissions = [];
	}
}
