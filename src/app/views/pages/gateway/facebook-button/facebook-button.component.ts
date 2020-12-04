import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';
import { forkJoin, from, of, Subject } from 'rxjs';
import { catchError, mergeMap, takeUntil } from 'rxjs/operators';
import { GatewayService, Login, User } from 'src/app/core/23blocks/gateway';
import { AppState } from 'src/app/core/reducers';
import normalize from 'json-api-normalizer';
import build from 'redux-object';
import { Router } from '@angular/router';
// import { AlertComponent } from '../modals/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-facebook-button',
  templateUrl: './facebook-button.component.html',
  styleUrls: ['./facebook-button.component.scss'],
})
export class FacebookButtonComponent implements OnInit, OnDestroy {
  unsubscribe: Subject<void>;
  icons = {
    faFacebookF: faFacebookF,
  };

  @Output() login = new EventEmitter<User>();
  constructor(
    private socialAuthService: SocialAuthService,
    private store: Store<AppState>,
    private auth: GatewayService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {}
  signInWithFB = (): void => {
    from(this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(
        takeUntil(this.unsubscribe),
        mergeMap((socialUser) => {
          if (socialUser) {
            return this.auth.facebookLogin(socialUser.authToken);
          }
        }),
        mergeMap((apiResponse) => {
          const data: any = normalize(apiResponse);
          const _user: User = build(data, 'user', apiResponse.data.id, {
            eager: true,
          });
          return forkJoin([
            this.auth.getProfile(_user.uniqueId).pipe(
              catchError((error) => {
                console.log(error);
                return of(null);
              })
            ),
            of(_user),
          ]);
        })
      )
      .subscribe(
        ([apiResponse, user]) => {
          const data: any = normalize(apiResponse);
          const _profile = build(data, 'userProfile', apiResponse.data.id, {
            eager: true,
          });
          if (_profile.payload && _profile.payload.team) {
            this.store.dispatch(
              new Login({
                authToken: localStorage.getItem('companyToken'),
              })
            );
            this.router.navigate(['/recorder']);
          } else {
            this.login.emit(user);
          }
        },
        (error) => {
          this.showAlert(
            'Ha ocurrido un error, es posible que ya estes registrado con tu correo electronico'
          );
          console.log(error);
        }
      );
  };

  showAlert(message: string, link?: string, action?: Function) {
    // this.dialog.open(AlertComponent, {
    //   width: '250px',
    //   data: { message, link, action },
    //   panelClass: 'tigo-theme',
    // });
    alert(message);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
