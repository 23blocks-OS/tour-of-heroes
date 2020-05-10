// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
// Services
import { GatewayService } from '../services/gateway.service';
// Actions
import {
    AllPermissionsLoaded,
    AllPermissionsRequested,
    PermissionActionTypes
} from '../actions/permission.actions';
// Models
import { Permission } from '../models/permission.model';
import {ApiResponse} from '../../models/api-response.model';

@Injectable()
export class PermissionEffects {
    @Effect()
    loadAllPermissions$ = this.actions$
        .pipe(
            ofType<AllPermissionsRequested>(PermissionActionTypes.AllPermissionsRequested),
            mergeMap(() => this.auth.getAllPermissions()),
            map((result: ApiResponse ) => {
              const loadedPermissions: Permission[] = [];
              result.data.forEach( (item) => {
                // console.log(item);
                const permission: Permission = new Permission();
                permission.id = +item.id;
                permission.name = item.attributes.name;
                permission.description = item.attributes.description;
                permission.level = item.attributes.level;
                permission.parentId = item.attributes.parent_id;
                loadedPermissions.push(permission);
              });

              return  new AllPermissionsLoaded({
                    permissions: loadedPermissions
                });
            })
          );

    @Effect()
    init$: Observable<Action> = defer(() => {
        return of(new AllPermissionsRequested());
    });

    constructor(private actions$: Actions, private auth: GatewayService) { }
}
