import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { NbAuthService } from "@nebular/auth";
import { tap } from "rxjs/operators";
import { APIService } from "../@core/mock/nec.service";

@Injectable()
export class PagesAuthGuard {
  constructor(
    private authService: NbAuthService,
    private router: Router,
    private service: APIService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const allowedRoles = route.data.allowedRoles as string[];
    console.log(allowedRoles)
    return this.authService.isAuthenticated().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.router.navigate(["auth/login"]);
        } else if (!allowedRoles.includes(this.service.user.roleId)) {
          console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
          console.log(allowedRoles)
          this.router.navigate(["pages/miscellaneous/404"]);
        }
      })
    );
  }
}
