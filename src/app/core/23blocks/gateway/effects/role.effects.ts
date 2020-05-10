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
import { allRolesLoaded } from '../selectors/role.selectors';
// Actions
import {
    AllRolesLoaded,
    AllRolesRequested,
    RoleActionTypes,
    RolesPageRequested,
    RolesPageLoaded,
    RoleUpdated,
    RolesPageToggleLoading,
    RoleDeleted,
    RoleOnServerCreated,
    RoleCreated,
    RolesActionToggleLoading
} from '../actions/role.actions';
import {ApiResponse} from '../../models/api-response.model';
import {Role} from '../models/role.model';

@Injectable()
export class RoleEffects {
    showPageLoadingDistpatcher = new RolesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new RolesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new RolesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new RolesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllRoles$ = this.actions$
        .pipe(
            ofType<AllRolesRequested>(RoleActionTypes.AllRolesRequested),
            withLatestFrom(this.store.pipe(select(allRolesLoaded))),
            filter(([action, isAllRolesLoaded]) => !isAllRolesLoaded),
            mergeMap(() => this.auth.getAllRoles()),
            map((result: ApiResponse)  => {
              const loadedRoles: Role[] = [];
              result.data.forEach( (item) => {
                // console.log(role);
                const role: Role = new Role();
                role.id = +item.id;
                role.name = item.attributes.name;
                role.code = item.attributes.code;
                const rolePermissions: number[] = [];
                item.relationships.permissions.data.forEach(( permission ) => {
                  rolePermissions.push(+permission.id);
                });
                role.permissions = rolePermissions;
                loadedRoles.push(role);
              });

              return new AllRolesLoaded({roles: loadedRoles});
                  })
                );

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

    @Effect()
    init$: Observable<Action> = defer(() => {
        return of(new AllRolesRequested());
    });

    constructor(private actions$: Actions, private auth: GatewayService, private store: Store<AppState>) { }
}
