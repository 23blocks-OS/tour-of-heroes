import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import {Gateway23blocksModule} from './core/23blocks/gateway/gateway-23blocks.module';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'auth', loadChildren: () => import('./views/pages/gateway/auth.module').then(m => m.AuthModule)},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}