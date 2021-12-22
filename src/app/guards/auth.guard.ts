import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { OverlayService } from '../service/overlay.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(    
    private router: Router    
  ) {}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const userToken = JSON.parse(localStorage.getItem('token'))

      if(!userToken){        
        localStorage.clear()
        this.router.navigate(['/login']);

        return false
      }  
         
      return true;
  }
  
}
