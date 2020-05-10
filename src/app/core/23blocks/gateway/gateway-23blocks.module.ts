import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


import { GatewayService } from './services/gateway.service';
import { Gateway23blocksInterceptor } from './interceptors/gateway-23blocks.interceptor';
import { Gateway23blocksOptions, GATEWAY_23BLOCKS_SERVICE_OPTIONS} from './models/gateway.interfaces';
import { UploadService } from './services/upload.service';
import {StoreModule} from '@ngrx/store';

import {EffectsModule} from '@ngrx/effects';




@NgModule({
  // imports: [
  //   StoreModule.forFeature('gateway', CRMReducer),
  //   EffectsModule.forFeature([CRMEffects])
  // ]
})

export class Gateway23blocksModule {

  constructor(@Optional() @SkipSelf() parentModule: Gateway23blocksModule) {
    if (parentModule) {
      throw new Error('gateway23Blocks is already loaded. It should only be imported in your application\'s main module.');
    }
  }
  static forRoot(options: Gateway23blocksOptions): ModuleWithProviders {
    return {
      ngModule: Gateway23blocksModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: Gateway23blocksInterceptor,
          multi: true
        },
        options.gatewayOptionsProvider ||
        {
          provide: GATEWAY_23BLOCKS_SERVICE_OPTIONS,
          useValue: options
        },
        GatewayService,
        UploadService
      ]
    };
  }
}
