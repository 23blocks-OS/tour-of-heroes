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
import {
  AuthActionTypes,
  Login,
  UserRequested,
  Logout,
  UserLoaded,
  Register,
  AvatarRequested,
  AvatarLoaded,
  SubscriptionLoaded,
} from '../actions/auth.actions';
// // import { AuthService } from '../_services/index';

import { GatewayService } from '../services/gateway.service';

import { AppState } from '../../../reducers';
import { environment } from '../../../../../environments/environment';
import {
  isAvatarLoaded,
  isCompanyLoaded,
  isUserLoaded,
} from '../selectors/auth.selectors';

import { CitiesRequested, StatesRequested } from '../actions/core.actions';

import { User } from '..';
// import {ApiUserResponse} from '../../legge/models/user.model';
import normalize from 'json-api-normalizer';
import build from 'redux-object';
import { CompaniesRequested } from '../actions/company.actions';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    tap((action) => {
      localStorage.setItem(environment.authTokenKey, action.payload.authToken);
      this.store.dispatch(new UserRequested());
    })
  );

  @Effect({ dispatch: false })
  loadUser$ = this.actions$.pipe(
    ofType<UserRequested>(AuthActionTypes.UserRequested),
    withLatestFrom(this.store.pipe(select(isUserLoaded))),
    filter(([action, _isUserLoaded]) => !_isUserLoaded),
    mergeMap(([action, _isUserLoaded]) => this.authService.validateToken()),
    tap(
      (authApiResponse) => {
        if (authApiResponse) {
          const data: any = normalize(authApiResponse);
          //normalize data for user
          console.log(data);
          const _user = build(data, 'user', authApiResponse.data.id, {
            eager: true,
          });
          //normalize data for subscription

          const _subscription = data.userSubscription
            ? build(data, 'userSubscription', null, {
                eager: true,
              })[0]
            : null;
          //normalize data for user profile
          const _userProfile = data.userProfile
            ? build(data, 'userProfile', null, {
                eager: true,
              })[0]
            : null;

          // Load User
          this.store.dispatch(new UserLoaded({ user: _user }));

          //Load Subscription
          this.store.dispatch(
            new SubscriptionLoaded({ subscription: _subscription })
          );

          // Load Avatar
          // this.store.dispatch(new AvatarRequested({ userId: _user.uniqueId }));
          this.store.dispatch(new StatesRequested());
          this.store.dispatch(new CitiesRequested());

          // this.store.dispatch(new CompaniesRequested({userId: _user.uniqueId}));
          // this.store.dispatch(new CompanyRequested({companyId: _user.userSubscription.uniqueId}));

          // switch (_user.roleId) {
          //   case 4:
          //     this.router.navigate(['/student/dashboard']);
          //     break;
          //   case 6:
          //     this.router.navigate(['/teacher/dashboard']);
          //     break;
          //   case 2:
          //     this.router.navigate(['/admin/dashboard']);
          //     break;
          //   default:
          //     this.router.navigate(['/student/dashboard']);
          //     break;
          // }
        } else {
          this.store.dispatch(new Logout());
        }
      },
      (error) => {
        console.log('Service Error - Load Identity');
        this.store.dispatch(new Logout());
      }
    )
  );

  @Effect({ dispatch: false })
  loadAvatar$ = this.actions$.pipe(
    ofType<AvatarRequested>(AuthActionTypes.AvatarRequested),
    withLatestFrom(this.store.pipe(select(isAvatarLoaded))),
    filter(([action, _isAvatarLoaded]) => !_isAvatarLoaded),
    mergeMap(([action, _isAvatarLoaded]) =>
      this.authService.getAvatar(action.payload.userId)
    ),
    tap((authApiResponse) => {
      // console.log('Avatar Requested');
      if (authApiResponse) {
        // console.log('Avatar returned from service');

        const data: any = normalize(authApiResponse);
        // console.log('email from ValidateToken:' + data.user[authApiResponse.data.id].attributes.email);
        const _avatar = build(data, 'userAvatar', authApiResponse.data.id, {
          eager: true,
        });
        // console.log(_avatar);

        this.store.dispatch(new AvatarLoaded({ avatar: _avatar }));
      }
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.Logout),
    withLatestFrom(this.store.pipe(select(isUserLoaded))),
    filter(([action, _isUserLoaded]) => !_isUserLoaded),
    mergeMap(([action, _isUserLoaded]) => this.authService.signOut()),
    tap(
      () => {
        // console.log('Log Out Effect');
        localStorage.removeItem(environment.authTokenKey);
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.returnUrl },
        });
      },
      (error) => {
        // console.log('Error Logout');
        localStorage.removeItem(environment.authTokenKey);
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.returnUrl },
        });
      }
    )
  );

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<Register>(AuthActionTypes.Register),
    tap((action) => {
      localStorage.setItem(environment.authTokenKey, action.payload.authToken);
    })
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    const userToken = localStorage.getItem(environment.authTokenKey);
    // console.log('App Init');
    let observableResult = of({ type: 'NO_ACTION' });
    if (userToken) {
      // console.log('User Logged before');
      observableResult = of(new Login({ authToken: userToken }));
    }
    return observableResult;
  });

  private returnUrl: string;

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<AppState>,
    private authService: GatewayService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
}
