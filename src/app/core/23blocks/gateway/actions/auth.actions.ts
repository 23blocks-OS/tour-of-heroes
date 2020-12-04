import { Action } from '@ngrx/store';
import { User } from '..';
import { Avatar } from '..';
import { Company } from '..';
import { Subscription } from '../models/subscription.model';

export enum AuthActionTypes {
  Login = '[Login] Action',
  Logout = '[Logout] Action',
  Register = '[Register] Action',
  UserRequested = '[Request User] API',
  UserLoaded = '[Load User] API',
  AvatarRequested = '[Request Avatar] API',
  AvatarLoaded = '[Load Avatar] API',
  SubscriptionRequested = '[Request Subscription] API',
  SubscriptionLoaded = '[Load Subscription] API',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: { authToken: string }) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class Register implements Action {
  readonly type = AuthActionTypes.Register;
  constructor(public payload: { authToken: string }) {}
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
  constructor(public payload: { avatar: Avatar }) {}
}

export class SubscriptionRequested implements Action {
  readonly type = AuthActionTypes.SubscriptionRequested;
  constructor(public payload: { subscriptionId: string; userId?: string }) {}
}

export class SubscriptionLoaded implements Action {
  readonly type = AuthActionTypes.SubscriptionLoaded;
  constructor(public payload: { subscription: Subscription }) {}
}

export type AuthActions =
  | Login
  | Logout
  | UserRequested
  | UserLoaded
  | AvatarRequested
  | AvatarLoaded
  | Register
  | SubscriptionRequested
  | SubscriptionLoaded;
