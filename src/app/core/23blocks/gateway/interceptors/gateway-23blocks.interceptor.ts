import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { GatewayService } from '../services/gateway.service';

import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class Gateway23blocksInterceptor implements HttpInterceptor {
  private headers: any;

  constructor(private gatewayService: GatewayService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.gatewayService.tokenOptions.apiBase === null ||
      req.url.match(this.gatewayService.tokenOptions.apiBase) ||
      req.url.match(environment.API_23GATEWAY_URL)
    ) {
      // console.log('Interceptor Gateway');
      // console.log('Before');
      // console.log(req.headers.get('appid'));
      // console.log(req.headers.get('company-token'));

      // Get auth data from local storage
      this.gatewayService.getAuthDataFromStorage();

      // Add the headers if the request is going to the configured server
      const authData = this.gatewayService.authData.value;

      if (authData) {
        this.headers = {
          'company-token': authData.companyToken,
          'access-token': authData.accessToken,
          client: authData.client,
          expiry: authData.expiry,
          'token-type': authData.tokenType,
          uid: authData.uid,
          appid: authData.appid,
        };
      } else {
        this.headers = {
          appid: environment.APPID,
        };
      }

      req = req.clone({
        setHeaders: this.headers,
      });
    }

    // console.log('After');
    // console.log(req, 'request');
    // console.log(req.headers, 'headers');
    // console.log(req.headers.get('appid'));
    // console.log(req.headers.get('company-token'));

    return next
      .handle(req)
      .pipe(
        tap(
          (res) => this.handleResponse(res),
          (err) => this.handleResponse(err)
        )
      )
      .pipe(
        catchError((err) => {
          if ([401, 403].indexOf(err.status) !== -1) {
            console.log('Out of HERE - Auth');
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            this.gatewayService.signOut().subscribe();
            this.router.navigate(['/auth/login']);
          }
          let errors = err.error
            ? err.error?.errors || {
                errors: [err.error?.message],
              } || { errors: [err.statusText] }
            : { ...err };
          if (err.status === 500 && err.statusText === 'OK') {
            errors = {
              status: 500,
              statusText: 'OK',
              message: err.message,
              error: err.error,
              url: err.url,
            };
          }
          // console.log(err, 'error before interceptor');
          // console.log(errors, 'error after interceptor');
          return throwError(errors);
        })
      );
  }

  // Parse Auth data from response
  private handleResponse(
    res: HttpResponse<any> | HttpErrorResponse | HttpEvent<any>
  ): void {
    if (res instanceof HttpResponse || res instanceof HttpErrorResponse) {
      if (
        this.gatewayService.tokenOptions.apiBase === null ||
        (res.url && res.url.match(this.gatewayService.tokenOptions.apiBase))
      ) {
        this.gatewayService.getAuthHeadersFromResponse(res);
      }
    }
  }
}
