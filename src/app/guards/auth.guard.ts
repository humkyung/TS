import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SignService } from '../service/rest-api/sign.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private signService: SignService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.signService.isAuthenticated()) {
      return true;
    } else {
      // 로그인이 되어있지 않으면 로그인 창으로 이동한다
      this.router.navigate(['/signin'], {queryParams: { redirectTo: state.url }});
      return false;
    }
  }
}