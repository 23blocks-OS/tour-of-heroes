import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

import { Observable, fromEvent, interval, BehaviorSubject, of } from 'rxjs';
import { pluck, filter, share, finalize } from 'rxjs/operators';

import {GATEWAY_23BLOCKS_SERVICE_OPTIONS} from '../models/gateway.interfaces';

import {
  SignInData,
  NewRegistrationData,
  UpdatePasswordData,
  ResetPasswordData,
  AuthApiResponse,
  Gateway23blocksOptions,
  AuthToken, Avatar
} from '../models/gateway.interfaces';

import {User} from '../models/user.model';
import {environment} from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class GatewayService  {

  // get currentUserData(): User {
  //   return this.userData.value;
  // }
  //
  // get currentAuthData(): AuthToken {
  //   return this.authData.value;
  // }

  get tokenOptions(): Gateway23blocksOptions {
    return this.options;
  }

  set tokenOptions(options: Gateway23blocksOptions) {
    this.options = (Object as any).assign(this.options, options);
  }

  private options: Gateway23blocksOptions;
  public authData: BehaviorSubject<AuthToken> = new BehaviorSubject<AuthToken>(null);
  public userData: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private global: Window | any;

  private localStorage: Storage | any = {};

  constructor(
    private http: HttpClient,
    @Inject(GATEWAY_23BLOCKS_SERVICE_OPTIONS) config: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() private activatedRoute: ActivatedRoute,
    @Optional() private router: Router
  ) {
    this.global = (typeof window !== 'undefined') ? window : {};

    if (isPlatformServer(this.platformId)) {

      // Bad pratice, needs fixing
      this.global = {
        open: (): void => null,
        location: {
          href: '/',
          origin: '/'
        }
      };

      // Bad pratice, needs fixing
      this.localStorage.setItem = (): void => null;
      this.localStorage.getItem = (): void => null;
      this.localStorage.removeItem = (): void => null;
    } else {
      this.localStorage = localStorage;
    }

    const defaultOptions: Gateway23blocksOptions = {
      apiPath:                    null,
      apiBase:                    null,
      APPID:						null,

      signInRedirect:             'auth/login',
      signInPath:                 'auth/sign_in',
      signInStoredUrlStorageKey:  null,

      signOutPath:                'auth/sign_out',
      validateTokenPath:          'auth/validate_token',
      signOutFailedValidate:      false,

      registerAccountPath:        'auth',
      deleteAccountPath:          'auth',
      registerAccountCallback:    this.global.location.href,

      updatePasswordPath:         'auth/password',
      addAvatarPath:		 		'/users/avatar',

      resetPasswordPath:          'auth/password',
      resetPasswordCallback:      this.global.location.href,

      loginField:                 'email',

      rolesPath:                 	'roles',
      permissionsPath:			'permissions',

      oAuthBase:                  this.global.location.origin,
      oAuthPaths: {
        github:                   'auth/github'
      },
      oAuthCallbackPath:          'oauth_callback',
      oAuthWindowType:            'newWindow',
      oAuthWindowOptions:         null,
    };

    const mergedOptions = (Object as any).assign(defaultOptions, config);
    this.options = mergedOptions;

    if (this.options.apiBase === null) {
      console.warn(`[Auth 23Blocks] You have not configured 'apiBase', which may result in security issues. ` +
        `Please refer to the documentation at https://github.com/neroniaky/angular-token/wiki`);
    }

    this.tryLoadAuthData();
  }

  /**
   *
   * Actions
   *
   */

  // Register User Request
  registerUser(registerData: NewRegistrationData): Observable<AuthApiResponse> {
    // console.log(registerData);
    this.clearAuthData();
    registerData.confirm_success_url = this.options.registerAccountCallback;
    return this.http.post<AuthApiResponse>(this.getApiPath(), registerData);
  }

  // Delete Account
  deleteAccount(): Observable<AuthApiResponse> {
    return this.http.delete<AuthApiResponse>(this.getServerPath() + this.options.deleteAccountPath);
  }

  // Sign in request and set storage
  signIn(signInData: SignInData, additionalData?: any): Observable<AuthApiResponse> {
    this.clearAuthData();
    const body = {
      [this.options.loginField]: signInData.login,
      password: signInData.password
      };

    return this.http.post<AuthApiResponse>(this.getServerPath() + this.options.signInPath, body);
  }

  signInOAuth(oAuthType: string) {

    const oAuthPath: string = this.getOAuthPath(oAuthType);
    const callbackUrl = `${this.global.location.origin}/${this.options.oAuthCallbackPath}`;
    const oAuthWindowType: string = this.options.oAuthWindowType;
    const authUrl: string = this.getOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);

    if (oAuthWindowType === 'newWindow') {
      const oAuthWindowOptions = this.options.oAuthWindowOptions;
      let windowOptions = '';

      if (oAuthWindowOptions) {
      for (const key in oAuthWindowOptions) {
        if (oAuthWindowOptions.hasOwnProperty(key)) {
        windowOptions += `,${key}=${oAuthWindowOptions[key]}`;
        }
      }
      }

      const popup = window.open(
      authUrl,
      '_blank',
      `closebuttoncaption=Cancel${windowOptions}`
      );
      return this.requestCredentialsViaPostMessage(popup);
    } else if (oAuthWindowType === 'sameWindow') {
      this.global.location.href = authUrl;
      return undefined;
    } else {
      throw new Error(`Unsupported oAuthWindowType "${oAuthWindowType}"`);
    }
  }

  processOAuthCallback(): void {
      this.getAuthDataFromParams();
  }

  // Sign out request and delete storage
  signOut(): Observable<AuthApiResponse> {
    return this.http.delete<AuthApiResponse>(this.getServerPath() + this.options.signOutPath)
    // Only remove the localStorage and clear the data after the call
      .pipe(
      finalize(() => {
        this.clearAuthData();
        }
      )
      );
  }

  // Validate token request
  validateToken(): Observable<AuthApiResponse> {
    // console.log('Validate Token');
    return this.http.get<AuthApiResponse>(this.getServerPath() + this.options.validateTokenPath);
  }

  // Update password request
  updatePassword(updatePasswordData: UpdatePasswordData): Observable<AuthApiResponse> {

    let args: any;

    if (updatePasswordData.passwordCurrent == null) {
      args = {
        password:               updatePasswordData.password,
        password_confirmation:  updatePasswordData.passwordConfirmation
      };
    } else {
      args = {
        current_password:       updatePasswordData.passwordCurrent,
        password:               updatePasswordData.password,
        password_confirmation:  updatePasswordData.passwordConfirmation
      };
    }

    if (updatePasswordData.resetPasswordToken) {
      args.reset_password_token = updatePasswordData.resetPasswordToken;
    }

    const body = args;
    return this.http.put<AuthApiResponse>(this.getServerPath() + this.options.updatePasswordPath, body);
  }

  // Reset password request
  resetPassword(resetPasswordData: ResetPasswordData): Observable<AuthApiResponse> {

    const body = {
      [this.options.loginField]: resetPasswordData.login,
      redirect_url: this.options.resetPasswordCallback
    };

    return this.http.post<AuthApiResponse>(this.getServerPath() + this.options.resetPasswordPath, body);
  }

  // Avatar
  addAvatar(avatar: Avatar) {
    return this.http.post(environment.API_23GATEWAY_URL + this.options.addAvatarPath, {avatar});
  }

  // Avatar
  getAvatar(userId: string): Observable<AuthApiResponse> {
    console.log('Avatar Service');
    return this.http.get(environment.API_23GATEWAY_URL + '/users/' + userId + '/avatar');
  }

  // Permissions
  getAllPermissions(): Observable<AuthApiResponse> {
    // console.log('Permissions Service Call');
    return this.http.get<AuthApiResponse>(this.getServerPath() + this.options.permissionsPath);
  }

  getAllRoles(): Observable<AuthApiResponse> {
    // console.log('Roles Service Call');
    return this.http.get<AuthApiResponse>(this.getServerPath() + this.options.rolesPath);
  }

  /**
   *
   * Construct Paths / Urls
   *
   */

  private getApiPath(): string {
    let constructedPath = '';

    if (this.options.apiBase != null) {
      constructedPath += this.options.apiBase + '/';
    }

    if (this.options.apiPath != null) {
      constructedPath += this.options.apiPath + '/';
    }

    return constructedPath;
  }

  private getServerPath(): string {
    return this.getApiPath();  // + this.getUserPath();
  }

  private getOAuthPath(oAuthType: string): string {
    let oAuthPath: string;

    oAuthPath = this.options.oAuthPaths[oAuthType];

    if (oAuthPath == null) {
      oAuthPath = `/auth/${oAuthType}`;
    }

    return oAuthPath;
  }

  private getOAuthUrl(oAuthPath: string, callbackUrl: string, windowType: string): string {
    let url: string;

    url =   `${this.options.oAuthBase}/${oAuthPath}`;
    url +=  `?omniauth_window_type=${windowType}`;
    url +=  `&auth_origin_url=${encodeURIComponent(callbackUrl)}`;

    return url;
  }


  /**
   *
   * Get Auth Data
   *
   */

  // Try to load auth data
  private tryLoadAuthData(): void {
    this.getAuthDataFromStorage();

    if (this.activatedRoute) {
      this.getAuthDataFromParams();
    }

    if (this.authData) {
        // this.validateToken();
    }
  }

  // Parse Auth data from response
  public getAuthHeadersFromResponse(data: HttpResponse<any> | HttpErrorResponse): void {
    const headers = data.headers;

    // console.log(headers);

    const authData: AuthToken = {
      companyToken: headers.get('company-token'),
      accessToken: headers.get('access-token'),
      client: headers.get('client'),
      expiry: headers.get('expiry'),
      tokenType: headers.get('token-type'),
      uid: headers.get('uid'),
      appid: environment.APPID
    };

    this.setAuthData(authData);
  }

  // Parse Auth data from post message
  private getAuthDataFromPostMessage(data: any): void {
    const authData: AuthToken = {
      companyToken:   data.company_token,
      accessToken:    data.auth_token,
      client:         data.client_id,
      expiry:         data.expiry,
      tokenType:      'Bearer',
      uid:            data.uid,
      appid: data.appid
    };

    this.setAuthData(authData);
  }

  // Try to get auth data from storage.
  public getAuthDataFromStorage(): void {

    const authData: AuthToken = {
      companyToken: this.localStorage.getItem('companyToken'),
      accessToken: this.localStorage.getItem('accessToken'),
      client: this.localStorage.getItem('client'),
      expiry: this.localStorage.getItem('expiry'),
      tokenType: this.localStorage.getItem('tokenType'),
      uid: this.localStorage.getItem('uid'),
      appid: this.localStorage.getItem('appid'),
    };

    if (this.checkAuthData(authData)) {
      this.authData.next(authData);
    }
  }

  // Try to get auth data from url parameters.
  private getAuthDataFromParams(): void {

  this.activatedRoute.queryParamMap.subscribe(queryParams => {
    const authData: AuthToken = {
      accessToken: queryParams.get('access-token'),
      client: queryParams.get('client_id'),
      expiry: queryParams.get('expiry'),
      tokenType: 'Bearer',
      uid: queryParams.get('uid'),
      appid: queryParams.get('appid'),
      companyToken: 'NA'
    };

    if (this.checkAuthData(authData)) {
      this.authData.next(authData);
    }

  });
}

  /**
   *
   * Set Auth Data
   *
   */

  // Write auth data to storage
  private setAuthData(authData: AuthToken): void {
    if (this.checkAuthData(authData)) {

      this.authData.next(authData);

      this.localStorage.setItem('companyToken', authData.companyToken);
      this.localStorage.setItem('accessToken', authData.accessToken);
      this.localStorage.setItem('client', authData.client);
      this.localStorage.setItem('expiry', authData.expiry);
      this.localStorage.setItem('tokenType', authData.tokenType);
      this.localStorage.setItem('uid', authData.uid);
      this.localStorage.setItem('appid', authData.appid);
    }
  }

  private clearAuthData() {
    this.localStorage.removeItem('companyToken');
    this.localStorage.removeItem('accessToken');
    this.localStorage.removeItem('client');
    this.localStorage.removeItem('expiry');
    this.localStorage.removeItem('tokenType');
    this.localStorage.removeItem('uid');
    this.localStorage.removeItem('appid');

    this.authData.next(null);
    this.userData.next(null);
  }

  /**
   *
   * Validate Auth Data
   *
   */

  // Check if auth data complete and if response token is newer
  private checkAuthData(authData: AuthToken): boolean {

    if (
        authData.companyToken != null &&
        authData.accessToken != null &&
        authData.client != null &&
        authData.expiry != null &&
        authData.tokenType != null &&
        authData.uid != null &&
        authData.appid != null
    ) {
      if (this.authData.value != null) {
        return authData.expiry >= this.authData.value.expiry;
      }
      return true;
    }
    return false;
  }


  /**
   *
   * OAuth
   *
   */

  private requestCredentialsViaPostMessage(authWindow: any): Observable<any> {
    const pollerObserv = interval(500);

    const responseObserv = fromEvent(this.global, 'message').pipe(
      pluck('data'),
      filter(this.oAuthWindowResponseFilter)
    );

    responseObserv.subscribe(
      this.getAuthDataFromPostMessage.bind(this)
    );

    const pollerSubscription = pollerObserv.subscribe(() => {
      if (authWindow.closed) {
        pollerSubscription.unsubscribe();
      } else {
        authWindow.postMessage('requestCredentials', '*');
      }
    });

    return responseObserv;
  }

  private oAuthWindowResponseFilter(data: any): any {
    if (data.message === 'deliverCredentials' || data.message === 'authFailure') {
      return data;
    }
  }


}
