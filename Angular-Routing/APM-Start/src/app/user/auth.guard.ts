import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canLoad(
    route: import("@angular/router").Route,
    segments: import("@angular/router").UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkLoggedIn(route.path);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLoggedIn(state.url);
  }

  checkLoggedIn(url: string) {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.authService.redirectURL = url;
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
