
export class Avatar {
	id: number;
	status: string;
	bucket: string;
	originalName: string;
	name: number;
	url: number;
	thumbnail: string;
	fileType: Date;
	fileSize: Date;
	description: Date;
	originalFile: Date;
	updatedAt: number;

	clear(): void {
		this.id = undefined;
	}
}
