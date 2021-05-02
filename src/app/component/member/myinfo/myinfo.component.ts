import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { User } from 'src/app/models/myinfo/User';

@Component({
  selector: 'app-myinfo',
  templateUrl: 'myinfo.component.html',
  styleUrls: ['myinfo.component.css']
})
export class MyinfoComponent implements OnInit {
  public userForm: FormGroup;
  public loginUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private myinfoService: MyinfoService,
    private dialogService: DialogService) {
      this.userForm = this.formBuilder.group(
        {
          name: new FormControl('', [Validators.required]),
          photo: new FormControl('')
        }
      );

      this.myinfoService.getUser().then(user => {
        this.loginUser = user as User;
      })
  }

  get f(){
    return this.userForm.controls;
  }

  ngOnInit(): void {
  }

  // 사용자 정보 업데이트
  public updateUser(){
    this.myinfoService.updateUser(this.loginUser).then(user => {
      window.location.reload();
    });
  }

  // 사용자 탈퇴
  public deleteUser(){
    this.dialogService.confirm('탈퇴 요청 확인', '정말로 탈퇴하시겠습니까?').afterClosed().subscribe(result => {
      if(result){
        this.myinfoService.deleteUser(this.loginUser).then(user => {
          window.location.reload();
        });
      }
    });
  }
}