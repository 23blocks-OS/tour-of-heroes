
import {Provider} from '@angular/core';
import { InjectionToken } from '@angular/core';

export interface Gateway23blocksOptions {
  gatewayOptionsProvider?: Provider;

  apiBase?: string;
  apiPath?: string;
  APPID: string;

  signInPath?: string;
  signInRedirect?: string;
  signInStoredUrlStorageKey?: string;

  signOutPath?: string;
  validateTokenPath?: string;
  signOutFailedValidate?: boolean;

  deleteAccountPath?: string;
  registerAccountPath?: string;
  registerAccountCallback?: string;

  updatePasswordPath?: string;
  addAvatarPath?: string;

  resetPasswordPath?: string;
  resetPasswordCallback?: string;

  loginField?: string;

  rolesPath?: string;
  permissionsPath?: string;

  oAuthBase?: string;
  oAuthPaths?: { [key: string]: string; };
  oAuthCallbackPath?: string;
  oAuthWindowType?: string;
  oAuthWindowOptions?: { [key: string]: string; };
}

export const GATEWAY_23BLOCKS_SERVICE_OPTIONS = new InjectionToken('GATEWAY_23BLOCKS_SERVICE_OPTIONS');

export interface AuthToken {
  companyToken: string;
  accessToken: string;
  client: string;
  expiry: string;
  tokenType: string;
  uid: string;
  appid: string;
}

// Actions

export interface SignInData {
  login: string;
  password: string;
}

export interface NewRegistrationData {
  uid: string;
  provider: string;
  email: string;
  password: string;
  username: string;
  name: string;
  confirm_success_url: string;
  subscription: string;
}

export interface UpdatePasswordData {
  password: string;
  passwordConfirmation: string;
  passwordCurrent?: string;
  resetPasswordToken?: string;
}

export interface ResetPasswordData {
  login: string;
}

// API Response Format

export interface AuthApiResponse {
  status?: string;
  success?: boolean;
  statusText?: string;
  data?: any;
  include?: any;
  errors?: any;
  meta?: any;
}

// Configuration Options


export interface Avatar {
  original_name: string;
  name: string;
  url: string;
  thumbnail: string;
  file_type: string;
  file_size: string;
  description: string;
  original_file: string;
}

