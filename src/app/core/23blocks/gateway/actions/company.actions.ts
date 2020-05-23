// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD

// Models
import { Company } from '../models/company.model';
import {QueryParamsModel} from '../../tools/query-params.model';

export enum CompanyActionTypes {
    CompaniesRequested = '[Companies Requested] API',
    CompaniesLoaded = '[Companies Loaded] API',
    CompanyRequested = '[Company Requested] API',
    CompanyLoaded = '[Company Loaded] API',
    // RoleOnServerCreated = '[Edit Role Dialog] Role On Server Created',
    // RoleCreated = '[Edit Roles Dialog] Roles Created',
    // RoleUpdated = '[Edit Role Dialog] Role Updated',
    // RoleDeleted = '[Roles List Page] Role Deleted',
    // RolesPageRequested = '[Roles List Page] Roles Page Requested',
    // RolesPageLoaded = '[Roles API] Roles Page Loaded',
    // RolesPageCancelled = '[Roles API] Roles Page Cancelled',
    // RolesPageToggleLoading = '[Roles page] Roles Page Toggle Loading',
    // RolesActionToggleLoading = '[Roles] Roles Action Toggle Loading'
}

// export class RoleOnServerCreated implements Action {
//     readonly type = RoleActionTypes.RoleOnServerCreated;
//     constructor(public payload: { role: Role }) { }
// }
//
// export class RoleCreated implements Action {
//     readonly type = RoleActionTypes.RoleCreated;
//     constructor(public payload: { role: Role }) { }
// }
//
// export class RoleUpdated implements Action {
//     readonly type = RoleActionTypes.RoleUpdated;
//     constructor(public payload: {
//         partialrole: Update<Role>,
//         role: Role
//     }) { }
// }
//
// export class RoleDeleted implements Action {
//     readonly type = RoleActionTypes.RoleDeleted;
//     constructor(public payload: { id: number }) {}
// }
//
// export class RolesPageRequested implements Action {
//     readonly type = RoleActionTypes.RolesPageRequested;
//     constructor(public payload: { page: QueryParamsModel }) { }
// }

// export class RolesPageLoaded implements Action {
//     readonly type = RoleActionTypes.RolesPageLoaded;
//     constructor(public payload: { roles: Role[], totalCount: number, page: QueryParamsModel }) { }
// }
//
// export class RolesPageCancelled implements Action {
//     readonly type = RoleActionTypes.RolesPageCancelled;
// }

export class CompaniesRequested implements Action {
    readonly type = CompanyActionTypes.CompaniesRequested;
    constructor(public payload: { userId: string }) {}
}

export class CompaniesLoaded implements Action {
    readonly type = CompanyActionTypes.CompaniesLoaded;
    constructor(public payload: { companies: Company[] }) { }
}

export class CompanyRequested implements Action {
  readonly type = CompanyActionTypes.CompanyRequested;
  constructor(public payload: { urlId: string }) {}
}

export class CompanyLoaded implements Action {
  readonly type = CompanyActionTypes.CompanyLoaded;
  constructor(public payload: { company: Company }) { }
}
// export class RolesPageToggleLoading implements Action {
//     readonly type = RoleActionTypes.RolesPageToggleLoading;
//     constructor(public payload: { isLoading: boolean }) { }
// }
//
// export class RolesActionToggleLoading implements Action {
//     readonly type = RoleActionTypes.RolesActionToggleLoading;
//     constructor(public payload: { isLoading: boolean }) { }
// }

export type CompanyActions = CompaniesLoaded | CompaniesRequested |
  CompanyRequested | CompanyLoaded

//   RoleCreated
// | RoleUpdated
// | RoleDeleted
// | RolesPageRequested
// | RolesPageLoaded
// | RolesPageCancelled
// | AllCompaniesLoaded
// | AllCompaniesRequested
// | RoleOnServerCreated
// | RolesPageToggleLoading
// | RolesActionToggleLoading;
