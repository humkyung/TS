import { Component } from '@angular/core';
import { User } from './models/myinfo/User';
import { SignService } from './service/rest-api/sign.service'
import { MyinfoService } from './service/rest-api/myinfo.service';
import { LoadingSpinnerService } from './service/loading-spinner/loading-spinner.service';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ATOOLS';
  public loginUser: User;

  constructor(
    public signService: SignService,
    private myinfoService: MyinfoService,
    private router: Router,
    private loadingSpinnerService: LoadingSpinnerService){
      if(this.signService.isAuthenticated()){
        this.myinfoService.getUser()
        .then(user => {
          this.loginUser = user;
        });
      }

       // 화면전환이 일어나는 이벤트를 구독한다.
      router.events.subscribe((event: RouterEvent) => {
        this.updateLoadingSpinner(event);
      });
    }

  private updateLoadingSpinner(event: RouterEvent): void{
    // 화면전환이 시작될때 로딩 스피너를 노출시킨다.
    if(event instanceof NavigationStart){
      this.loadingSpinnerService.show();
    }

    // 화면전환이 완료되었거나 취소되었거나 오류가 발생하면 로딩 스피너를 감춘다.
    if(event instanceof NavigationEnd || 
      event instanceof NavigationCancel ||
      event instanceof NavigationError){
        this.loadingSpinnerService.hide();
    }
  }

  public logout(){
    localStorage.removeItem('x-auth-token')
    localStorage.removeItem('loginUser');
    this.router.navigate(['/']);
  }
}
