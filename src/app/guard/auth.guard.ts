import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  authed: boolean = false;
  constructor(
    private authService: AuthenticationService,
    private commonService: CommonService,
    private router: Router

  ) {
    console.log("auth guard call")
    if((typeof window)=='undefined'){
      return
    }
  }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //     return true;
  //   }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("authenticated: ",this.authService.isAuthenticated())
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
       // go to login if not authenticated
        return false;
      }
      else{
        return true;

      }

    }

}

