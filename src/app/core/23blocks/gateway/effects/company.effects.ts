// Angular
import { Injectable } from '@angular/core';
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import {QueryResultsModel} from '../../tools/query-results.model';
import {QueryParamsModel} from '../../tools/query-params.model';
// Services
import { GatewayService } from '../services/gateway.service';
// State
import {AppState} from '../../../reducers';
// Selectors
import { isCompaniesLoaded } from '../selectors/company.selectors';
// Actions
import {
  CompaniesLoaded,
  CompaniesRequested, CompanyActionTypes,
  CompanyLoaded, CompanyRequested
  // RoleActionTypes,
  // RolesPageRequested,
  // RolesPageLoaded,
  // RoleUpdated,
  // RolesPageToggleLoading,
  // RoleDeleted,
  // RoleOnServerCreated,
  // RoleCreated,
  // RolesActionToggleLoading
} from '../actions/company.actions';
import {ApiResponse} from '../../models/api-response.model';
import {Company} from '../models/company.model';
import normalize from 'json-api-normalizer';
import build from 'redux-object';
import {Router} from '@angular/router';

@Injectable()
export class CompanyEffects {
    // showPageLoadingDistpatcher = new RolesPageToggleLoading({ isLoading: true });
    // hidePageLoadingDistpatcher = new RolesPageToggleLoading({ isLoading: false });
    //
    // showActionLoadingDistpatcher = new RolesActionToggleLoading({ isLoading: true });
    // hideActionLoadingDistpatcher = new RolesActionToggleLoading({ isLoading: false });

    @Effect({dispatch: false})
    loadAllCompanies$ = this.actions$
        .pipe(
          ofType<CompaniesRequested>(CompanyActionTypes.CompaniesRequested),
          withLatestFrom(this.store.pipe(select(isCompaniesLoaded))),
          // filter(([action, isAllCompaniesLoaded]) => !isAllCompaniesLoaded),
          mergeMap(([action, isAllCompaniesLoaded]) => this.auth.getCompanies(action.payload.userId)),
          tap(authApiResponse => {

            // console.log('Companies Requested');
            if (authApiResponse) {
              // console.log('Companies returned from service');
              // console.log(authApiResponse);
              const data: any = normalize(authApiResponse);
              // console.log('email from ValidateToken:' + data.user[authApiResponse.data.id].attributes.email);
              const _companies = build(data, 'company', null, { eager: true });
              console.log(_companies);

              if (_companies) {
                this.store.dispatch(new CompaniesLoaded({ companies: _companies }));
              }
              else
              {
                this.router.navigate(['/on-boarding/user']);
              }
            }
          }
        ));

  @Effect({dispatch: false})
  loadCompany$ = this.actions$
    .pipe(
      ofType<CompanyRequested>(CompanyActionTypes.CompanyRequested),
      withLatestFrom(this.store.pipe(select(isCompaniesLoaded))),
      filter(([action, _isCompanyLoaded]) => !_isCompanyLoaded),
      mergeMap(([action, _isCompanyLoaded]) => this.auth.getCompany(action.payload.urlId)),
      tap(authApiResponse => {
          // console.log('Company Requested');
          if (authApiResponse) {
            // console.log('Company returned from service');

            const data: any = normalize(authApiResponse);
            const _company = build(data, 'company', authApiResponse.data.id, { eager: true });
            console.log(_company);

            this.store.dispatch(new CompanyLoaded({ company: _company }));
          }
        }
      ));

    // @Effect()
    // loadRolesPage$ = this.actions$
    //     .pipe(
    //         ofType<RolesPageRequested>(RoleActionTypes.RolesPageRequested),
    //         mergeMap(( { payload } ) => {
    //             this.store.dispatch(this.showPageLoadingDistpatcher);
    //             const requestToServer = this.auth.findRoles(payload.page);
    //             const lastQuery = of(payload.page);
    //             return forkJoin(requestToServer, lastQuery);
    //         }),
    //         map(response => {
    //             const result: QueryResultsModel = response[0];
    //             const lastQuery: QueryParamsModel = response[1];
    //             this.store.dispatch(this.hidePageLoadingDistpatcher);
	//
    //             return new RolesPageLoaded({
    //                 roles: result.items,
    //                 totalCount: result.totalCount,
    //                 page: lastQuery
    //             });
    //         }),
    //     );

    // @Effect()
    // deleteRole$ = this.actions$
    //     .pipe(
    //         ofType<RoleDeleted>(RoleActionTypes.RoleDeleted),
    //         mergeMap(( { payload } ) => {
    //                 this.store.dispatch(this.showActionLoadingDistpatcher);
    //                 return this.auth.deleteRole(payload.id);
    //             }
    //         ),
    //         map(() => {
    //             return this.hideActionLoadingDistpatcher;
    //         }),
    //     );

    // @Effect()
    // updateRole$ = this.actions$
    //     .pipe(
    //         ofType<RoleUpdated>(RoleActionTypes.RoleUpdated),
    //         mergeMap(( { payload } ) => {
    //             this.store.dispatch(this.showActionLoadingDistpatcher);
    //             return this.auth.updateRole(payload.role);
    //         }),
    //         map(() => {
    //             return this.hideActionLoadingDistpatcher;
    //         }),
    //     );


    // @Effect()
    // createRole$ = this.actions$
    //     .pipe(
    //         ofType<RoleOnServerCreated>(RoleActionTypes.RoleOnServerCreated),
    //         mergeMap(( { payload } ) => {
    //             this.store.dispatch(this.showActionLoadingDistpatcher);
    //             return this.auth.createRole(payload.role).pipe(
    //                 tap(res => {
    //                     this.store.dispatch(new RoleCreated({ role: res }));
    //                 })
    //             );
    //         }),
    //         map(() => {
    //             return this.hideActionLoadingDistpatcher;
    //         }),
    //     );

    // @Effect()
    // init$: Observable<Action> = defer(() => {
    //     return of(new AllCompaniesRequested());
    // });

    constructor(private actions$: Actions,
                private router: Router,
                private auth: GatewayService,
                private store: Store<AppState>) { }
}
