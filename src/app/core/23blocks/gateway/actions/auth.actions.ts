import { Action } from '@ngrx/store';
import { User } from '..';
import { Avatar } from '..';
import { Company } from '..';

export enum AuthActionTypes {
  Login = '[Login] Action',
  Logout = '[Logout] Action',
  Register = '[Register] Action',
  UserRequested = '[Request User] API',
  UserLoaded = '[Load User] API',
  AvatarRequested = '[Request Avatar] API',
  AvatarLoaded = '[Load Avatar] API',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: { authToken: string }) { }
}

export class Logout implements Action {
    readonly type = AuthActionTypes.Logout;
}

export class Register implements Action {
  readonly type = AuthActionTypes.Register;
  constructor(public payload: { authToken: string }) { }
}

export class UserRequested implements Action {
    readonly type = AuthActionTypes.UserRequested;
}

export class UserLoaded implements Action {
  readonly type = AuthActionTypes.UserLoaded;
  constructor(public payload: { user: User }) {}
}

// export class CompanyRequested implements Action {
//   readonly type = AuthActionTypes.CompanyRequested;
//   constructor(public payload: { companyId: string }) {}
// }
//
// export class CompanyLoaded implements Action {
//   readonly type = AuthActionTypes.CompanyLoaded;
//   constructor(public payload: { company: Company }) {}
// }

export class AvatarRequested implements Action {
  readonly type = AuthActionTypes.AvatarRequested;
  constructor(public payload: { userId: string }) {}
}

export class AvatarLoaded implements Action {
  readonly type = AuthActionTypes.AvatarLoaded;
  constructor(public payload: { avatar: Avatar }) { }
}

export type AuthActions = Login | Logout | UserRequested | UserLoaded | AvatarRequested | AvatarLoaded | Register
