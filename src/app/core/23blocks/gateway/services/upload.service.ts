import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {GatewayService} from './gateway.service';

interface ApiUploadResult {
	url: string;
}

export interface UploadResult {
	name: string;
	type: string;
	size: number;
	url: string;
}

export interface AWSUrl {
	presigned_url: string;
	public_url: string;
	signed_url: string;
	file_name: string;
}

@Injectable()
export class UploadService {

	// tslint:disable-next-line:variable-name
	aws_url: string;
	// tslint:disable-next-line:variable-name
	aws_read_url: string;


	constructor(private http: HttpClient, private auth23service: GatewayService) {
	}

	// @ts-ignore
	public async uploadAvatar( file: File, userId: string ): Promise<UploadResult> {

		const url = environment.API_23GATEWAY_URL + '/users/' + userId  + '/presign_upload';
		const userData: BehaviorSubject<AWSUrl> = new BehaviorSubject<AWSUrl>(null);
		// console.log('Getting signed URL');
		await this.http.put<AWSUrl>(url, {filename: file.name})
			// tslint:disable-next-line:variable-name
			.toPromise().then(aws_result => {
				userData.next(aws_result);
				// console.log('temp url');
				// console.log(aws_result);
				this.aws_url = aws_result.presigned_url;
				this.aws_read_url = aws_result.signed_url;
			});

		// const headers: new
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': file.type
			})
		};

		// tslint:disable-next-line:variable-name
		await this.http.put(this.aws_url, file, httpOptions)
			// tslint:disable-next-line:variable-name
			.toPromise().then(aws_response => {
				console.log('file ' + file.name + ' was safely store in AWS');
				this.auth23service.addAvatar({
					original_name: file.name,
					name: userData.value.file_name,
					url: this.aws_read_url,
					thumbnail: '',
					file_type: file.type,
					file_size: file.size.toString(),
					description: '',
					original_file: file.name })
					.subscribe( leggeResponse => {
						console.log('file: ' + file.name + ' was processed by Auth Service');
					});
			});


		return {
			name: file.name,
			type: file.type,
			size: file.size,
			url: userData.value.signed_url
		};

	}


}
