import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { MessagesComponent } from './messages/messages.component';

import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { metaReducers, reducers } from './core/reducers';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Gateway23blocksModule } from './core/23blocks/gateway/gateway-23blocks.module';
import {
  SocialLoginModule,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { GatewayGuard } from './core/23blocks/gateway';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    Gateway23blocksModule.forRoot({
      apiBase: environment.API_23GATEWAY_URL,
      APPID: environment.APPID,
      registerAccountCallback: environment.APP_URL + '/auth/step2/',
      resetPasswordCallback: environment.APP_URL + '/auth/change-password/',
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    NgbModule,
  ],
  providers: [
    GatewayGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('816866012448958'),
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '917615737635-7iqjdclcehug9gfv4v62jrfv8tb97vno.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
