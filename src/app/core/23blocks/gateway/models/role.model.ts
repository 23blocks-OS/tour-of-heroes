export class Role {
  id: number;
  name: string;
  code: string;
  permissions: number[];
  payload?: any;

  clear?(): void {
    this.id = undefined;
    this.name = '';
    this.code = '';
    this.permissions = [];
  }
}
