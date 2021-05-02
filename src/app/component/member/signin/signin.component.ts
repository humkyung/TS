import { DialogService } from '../../../service/dialog/dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SignService } from 'src/app/service/rest-api/sign.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css' ]
})
export class SigninComponent implements OnInit {
  redirectTo: string;
  signInForm: FormGroup;

  constructor(
    private signService: SignService, 
    private router: Router, 
    private route: ActivatedRoute,
    private dialogService: DialogService) {
    this.signInForm = new FormGroup(
      {id: new FormControl('', [Validators.required, Validators.email]), 
      //TODO: 암호 패턴 조정(영문 대소문자와 숫자 그리고 특수문자로 조합된 암호만 허용하도록)
      password: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]/), Validators.minLength(4)])});
   }

  get id(){
    return this.signInForm.get('id')
  }

  get password(){
    return this.signInForm.get('password')
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectTo = params['redirectTo']
    });
  }

  submit(){
    if(this.signInForm.valid){
      this.signService.signIn(this.signInForm.value.id, this.signInForm.value.password)
      .then(data => {
        this.router.navigate([this.redirectTo ? this.redirectTo : '/']);
        });
    }
  }
}
