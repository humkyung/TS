import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle'
import { ApiValidationService } from './common/api-validation.service'
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { env } from 'process';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class SignService {
  private signInUrl = environment.apiUrl + '/signin';
  private signUpUrl = environment.apiUrl + '/signup';
  private TOKEN_NAME = environment.TOKEN_NAME;

  constructor(
    private http: HttpClient, 
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) {

     }

  // 토큰 유효성 검사
  public isAuthenticated(): boolean{
    const token = localStorage.getItem(this.TOKEN_NAME);
    return token ? !this.isTokenExpired(token) : false;
  }

  signIn(id: string, password: string): Promise<any>{
    const params = {'uid': id, 'name': id, 'password': password};

    //  new FormData();
    //params.append('id', id);
    //params.append('password', password);

    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'}
      )};

    const url = this.signInUrl;
    return this.http.post<ApiResponseSingle>(url, params, httpOptions)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      localStorage.setItem(this.TOKEN_NAME, response.data);
    })
    .catch(response => {
      this.dialogService.alert('오류', '[Fail to login]\n' + response.msg);
      return Promise.reject(response.msg);
    })
  }

  // 사용자를 등록한다
  signUp(id: string, password: string, name: string): Promise<any>{
    const params = new FormData();
    params.append('id', id);
    params.append('password', password);
    params.append('name', name);
    return this.http.post<ApiResponseSingle>(this.signUpUrl, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[가입 실패]\n' + response.msg);
      return Promise.reject(response.msg);
    })
  }

  /*
    token 유효 기간 체크
    The JwtHelper class has several useful methods that can be utilized in your components:

    decodeToken
    getTokenExpirationDate
    isTokenExpired

    npm install @auth0/angular-jwt
    https://github.com/auth0/angular2-jwt
  */
  // 토큰의 유효 기간을 검사한다
  private isTokenExpired(token: string) {
    // return false;
    return jwtHelper.isTokenExpired(token);
  }
}
