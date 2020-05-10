// Actions
import {AuthActions, AuthActionTypes} from '../actions/auth.actions';
// Models
import {User} from '../models/user.model';
import {Avatar} from '../models/avatar.model';

export interface AuthState {
  loggedIn: boolean;
  uniqueId: string;
  roleId: number;
  user: User;
  avatar: Avatar;
  authToken: string;
  isUserLoaded: boolean;
  isAvatarLoaded: boolean;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  uniqueId: undefined,
  roleId: undefined,
  user: undefined,
  avatar: undefined,
  authToken: undefined,
  isUserLoaded: false,
isAvatarLoaded: false
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.Login: {
      const _token: string = action.payload.authToken;
      return {
        loggedIn: true,
        authToken: _token,
        uniqueId: undefined,
        roleId: undefined,
        user: undefined,
        isUserLoaded: false,
        avatar: undefined,
        isAvatarLoaded: false
      };
    }

    case AuthActionTypes.Register: {
      const _token: string = action.payload.authToken;
      return {
        loggedIn: true,
        authToken: _token,
        uniqueId: undefined,
        roleId: undefined,
        user: undefined,
        isUserLoaded: false,
        avatar: undefined,
        isAvatarLoaded: false
      };
    }

    case AuthActionTypes.Logout: {
      console.log('LogOut Reducer');
      return initialAuthState;
    }

    case AuthActionTypes.UserLoaded: {
      console.log('User Loaded action');
      // console.log(action.payload.authUser.name);
      // console.log('email: ' + action.payload.authUser.email);

      const _user: User = action.payload.user;

      return {
        ...state,
        loggedIn: true,
        uniqueId: _user.uniqueId,
        roleId: _user.roleId,
        user: _user,
        avatar: undefined,
        authToken: undefined,
        isUserLoaded: true,
        isAvatarLoaded: false
      };
    }

    case AuthActionTypes.AvatarLoaded: {
      // console.log('Reducer: Avatar Loaded');
      const _userAvatar: Avatar = action.payload.avatar;

      return {
        ...state,
        avatar: _userAvatar,
        isAvatarLoaded: true
      };
    }

    default:
      return state;
    }
}

