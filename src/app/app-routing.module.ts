import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [ 
  
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadChildren: () => import('./page/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./page/tracking/tracking.module').then( m => m.TrackingPageModule)
  },   {
    path: 'user',
    loadChildren: () => import('./page/user/user.module').then( m => m.UserPageModule)
  },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
