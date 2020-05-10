import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {finalize, map, takeUntil, tap} from 'rxjs/operators';
import {AuthNoticeService, GatewayService} from '../../../../core/23blocks/gateway';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmPasswordValidator} from '../register/confirm-password.validator';

@Component({
  selector: 'app-gateway-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

	changePasswordForm: FormGroup;
	loading = false;
	errors: any = [];

	// access-token=x-2zO2CBgci-RiWj8yXR0A
	// client=z2GZhU8BMgFfLcb08yx-Uw
	// client_id=z2GZhU8BMgFfLcb08yx-Uw
	// config=
	// expiry=1577857208
	// reset_password=true
	// token=x-2zO2CBgci-RiWj8yXR0A
	// uid=jkpelaez2%40hotmail.com

	// accessToken: string;
	// client: string;
	// clientId: string;
	// config: string;
	// expiry: string;
	// resetPassword: string;
	// token: string;
	// uid: string;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param authService
	 * @param authNoticeService
	 * @param translate
	 * @param router
	 * @param route
	 * @param fb
	 * @param cdr
	 */
	constructor(
		private authService: GatewayService,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		console.log('token');
		this.route.queryParamMap.subscribe(queryParams => {

			if (queryParams.get('token-expired') === 'true') {
				this.router.navigateByUrl('/auth/token-expired');
			}
		});

		this.initChangePasswordForm();
		// this.route.queryParamMap.subscribe(queryParams => {
		// 	this.accessToken = queryParams.get('access-token');
		// 	this.client = queryParams.get('client');
		// 	this.clientId = queryParams.get('client_id');
		// 	this.config = queryParams.get('config');
		// 	this.expiry = queryParams.get('expiry');
		// 	this.resetPassword = queryParams.get('reset_password');
		// 	this.token = queryParams.get('token');
		// 	this.uid = queryParams.get('uid');
		// });
		//
		// console.log(this.accessToken);
		// console.log(this.client);
		// console.log(this.clientId);
		// console.log(this.config);
		// console.log(this.expiry);
		// console.log(this.resetPassword);
		// console.log(this.token);
		// console.log(this.uid);

	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initChangePasswordForm() {
		this.changePasswordForm = this.fb.group({
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(100)
			])]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.changePasswordForm.controls;
		/** check form */
		if (this.changePasswordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		this.authService.updatePassword({ password: controls.password.value,
			passwordConfirmation: controls.confirmPassword.value})
			.pipe(
			tap(response => {
				if (response) {
					this.authNoticeService.setNotice('Clave cambiada exitosamente', 'success');
					this.router.navigateByUrl('/auth/login');
				} else {
					this.authNoticeService.setNotice('No fue posible cambiar la clave', 'danger');
				}
			},
				errors => {
					this.authNoticeService.setNotice(errors[0].detail.join('<br/>'), 'danger');
			}),
			takeUntil(this.unsubscribe),
			finalize(() => {
				this.loading = false;
				this.cdr.markForCheck();
			})
		).subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.changePasswordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
}
