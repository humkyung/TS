import { Component, OnInit } from '@angular/core';
// import { ThemeService } from '../core/services/theme.service';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service'
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { AvatarPhotoComponent } from 'src/app/avatar-photo/avatar-photo.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isDarkTheme: Observable<boolean>;
  public loginUser: User;

  constructor(
    public signService: SignService,
    private myinfoService: MyinfoService) {
      if(this.signService.isAuthenticated()){
        this.myinfoService.getUser()
        .then(user => {
          this.loginUser = user;
        });
      }
     }
  // constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    // this.isDarkTheme = this.themeService.isDarkTheme;
  }

  // toggleDarkTheme(checked: boolean) {
  //   this.themeService.setDarkTheme(checked);
  // }
}
