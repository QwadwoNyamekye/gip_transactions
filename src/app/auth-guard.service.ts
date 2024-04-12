import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { NbAuthService } from "@nebular/auth";
import { tap } from "rxjs/operators";
import { APIService } from "./@core/mock/nec.service";

@Injectable()
export class AuthGuard {
  constructor(
    private authService: NbAuthService,
    private router: Router,
    private service: APIService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.router.navigate(["auth/login"]);
        } else if (!this.service.user) {
          this.router.navigate(["auth/login"]);
        } else if (this.service.user.firstLogin) {
          this.router.navigate(["auth/reset-password"]);
        }
      })
    );
  }
}
