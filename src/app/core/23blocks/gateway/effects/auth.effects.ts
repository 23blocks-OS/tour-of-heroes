// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// // Auth actions
import {AuthActionTypes, Login, UserRequested, Logout, UserLoaded, Register, AvatarRequested, AvatarLoaded} from '../actions/auth.actions';
// // import { AuthService } from '../_services/index';

import { GatewayService } from '../services/gateway.service';

import {AppState} from '../../../reducers';
import {environment} from '../../../../../environments/environment';
import { isAvatarLoaded, isUserLoaded } from '../selectors/auth.selectors';

import {CitiesRequested, StatesRequested} from '../actions/core.actions';

import {User} from '..';
// import {ApiUserResponse} from '../../legge/models/user.model';
import normalize from 'json-api-normalizer';
import build from 'redux-object';

@Injectable()
export class AuthEffects {
  @Effect({dispatch: false})
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    tap(action => {
      localStorage.setItem(environment.authTokenKey, action.payload.authToken);
      this.store.dispatch(new UserRequested());
    }),
  );

  @Effect({dispatch: false})
  loadUser$ = this.actions$
    .pipe(
      ofType<UserRequested>(AuthActionTypes.UserRequested),
      withLatestFrom(this.store.pipe(select(isUserLoaded))),
      filter(([action, _isUserLoaded]) => !_isUserLoaded),
      mergeMap(([action, _isUserLoaded]) => this.authService.validateToken()),
      tap(authApiResponse => {
        // console.log('User Requested');
        if (authApiResponse) {
          // console.log('User returned from service');

          const data: any = normalize(authApiResponse);
          // console.log('email from ValidateToken:' + data.user[authApiResponse.data.id].attributes.email);
          const _user = build(data, 'user', authApiResponse.data.id, { eager: true });
          console.log('email from ValidateToken:' + _user.email);
          console.log(_user);

          // Load User
          this.store.dispatch(new UserLoaded({ user: _user }));

          // Load Avatar
          // console.log('Login Step 02 - Load Avatar');
          // console.log(_user.uniqueId);
          this.store.dispatch(new AvatarRequested({userId: _user.uniqueId}));
          this.store.dispatch(new StatesRequested());
          this.store.dispatch(new CitiesRequested());

        } else {
          console.log('No user returned from validate token');
          this.store.dispatch(new Logout());
        }
      },
        error => {
        console.log('Service Error - Load Identity');
        this.store.dispatch(new Logout());
      })
    );

  @Effect({dispatch: false})
  loadAvatar$ = this.actions$
    .pipe(
      ofType<AvatarRequested>(AuthActionTypes.AvatarRequested),
      withLatestFrom(this.store.pipe(select(isAvatarLoaded))),
      filter(([action, _isAvatarLoaded]) => !_isAvatarLoaded),
      mergeMap(([action, _isAvatarLoaded]) => this.authService.getAvatar(action.payload.userId)),
      tap(authApiResponse => {
          // console.log('Avatar Requested');
          if (authApiResponse) {
            // console.log('Avatar returned from service');

            const data: any = normalize(authApiResponse);
            // console.log('email from ValidateToken:' + data.user[authApiResponse.data.id].attributes.email);
            const _avatar = build(data, 'userAvatar', authApiResponse.data.id, { eager: true });
            // console.log(_avatar);

            this.store.dispatch(new AvatarLoaded({ avatar: _avatar }));
          }
        }
      ));

  @Effect({dispatch: false})
    logout$ = this.actions$
    .pipe(
          ofType<Logout>(AuthActionTypes.Logout),
      withLatestFrom(this.store.pipe(select(isUserLoaded))),
      filter(([action, _isUserLoaded]) => !_isUserLoaded),
      mergeMap(([action, _isUserLoaded]) => this.authService.signOut()),
          tap(() => {
            console.log('Log Out Effect');
            localStorage.removeItem(environment.authTokenKey);
            this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
          },
        error => {console.log('Error Logout');
          })
    );

  @Effect({dispatch: false})
  register$ = this.actions$.pipe(
    ofType<Register>(AuthActionTypes.Register),
    tap(action => {
      localStorage.setItem(environment.authTokenKey, action.payload.authToken);
    })
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    const userToken = localStorage.getItem(environment.authTokenKey);
    console.log('App Init');
    let observableResult = of({type: 'NO_ACTION'});
    if (userToken) {
      console.log('User Logged before');
      observableResult = of(new Login({  authToken: userToken }));
    }
    return observableResult;
  });

  private returnUrl: string;

  constructor(private actions$: Actions,
              private router: Router,
              private store: Store<AppState>,
              private authService: GatewayService ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
    }
  });
}
}
