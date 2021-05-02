import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';
// mat-error의 hasError 처리하기 위해 필요함
import { EmailValidation, PasswordValidation, RepeatPasswordEStateMatcher, RepeatPasswordValidator } from './validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signUpForm: FormGroup;
  passwordsMatcher = new RepeatPasswordEStateMatcher;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private signService: SignService,
    private dialogService: DialogService) {
      this.signUpForm = this.formBuilder.group({
        id: new FormControl('', Validators.compose([Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
        //TODO: 암호 패턴 조정(영문 대소문자와 숫자 그리고 특수문자로 조합된 암호만 허용하도록)
        password: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]/), Validators.minLength(4)]),
        password_re: new FormControl('', Validators.required),
        name: new FormControl('', [Validators.required])
      }, {validator: RepeatPasswordValidator});
     }

    private checkPassword(group: FormGroup){
      let password = group.controls.password.value;
      let passwordRe = group.controls.password_re.value;
      return password === '' || passwordRe === '' || password === passwordRe ? null : { notSame : true }
    }

  ngOnInit(): void {
  }

  get f(){
    return this.signUpForm.controls;
  }

  submit(){
    if(this.signUpForm.valid){
      this.signService.signUp(
        this.signUpForm.value.id, 
        this.signUpForm.value.password,
        this.signUpForm.value.name)
        .then(response => {
          this.signService.signIn(
            this.signUpForm.value.id,
            this.signUpForm.value.password)
            .then(response => {
              this.router.navigate(['/']);
            });
        })
        .catch(respose => {this.dialogService.alert("에러", "사용자 등록에 실패했습니다 - " + respose.msg);});
    }
  }
}
