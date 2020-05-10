

export class Permission {
	id: number;
	name: string;
	level: number;
	parentId: number;
	description: string;

	_children: Permission[];

	clear(): void {
		this.id = undefined;
		this.description = '';
		this.level = 1;
		this.parentId = undefined;
		this.name = '';
		this._children = [];
	}
}
