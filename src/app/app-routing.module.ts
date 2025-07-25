import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [ 
  
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule),canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadChildren: () => import('./page/orders/orders.module').then( m => m.OrdersPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'tracking',
    loadChildren: () => import('./page/tracking/tracking.module').then( m => m.TrackingPageModule),canActivate: [AuthGuard]
  },   {
    path: 'user',
    loadChildren: () => import('./page/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'update-user',
    loadChildren: () => import('./page/update-user/update-user.module').then( m => m.UpdateUserPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'password-change',
    loadChildren: () => import('./page/password-change/password-change.module').then( m => m.PasswordChangePageModule),canActivate: [AuthGuard]
  },  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
