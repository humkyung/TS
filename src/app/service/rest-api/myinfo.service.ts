import { Injectable } from '@angular/core';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiValidationService } from './common/api-validation.service'
import { User } from 'src/app/models/myinfo/User';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MyinfoService {
  private getUserUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient,
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) { }

  // 모든 회원 목록을 받는다.
  public getAllUsers(): Promise<User[]>{
    const url = this.getUserUrl + '/all';
    return this.http.get<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as User[];
    })
    .catch(response => {
      localStorage.removeItem('x-auth-token');
      this.dialogService.alert('오류', '[회원 목록 조회 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  public getUser(): Promise<User>{
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    if(loginUser == null){
      return this.http.get<ApiResponseSingle>(this.getUserUrl)
      .toPromise()
      .then(this.apiValidationService.validateResponse)
      .then(response => {
        localStorage.setItem('loginUser', JSON.stringify(response.data));
        return response.data as User;
      })
      .catch(response => {
        localStorage.removeItem('x-auth-token');
        this.dialogService.alert('오류', '[회원 정보 조회 중 오류 발생]\n' + response.msg);
        return Promise.reject(response.msg);
      });
    }else{
      return Promise.resolve(loginUser);
    }
  }

  // 사용자 정보를 업데이트한다
  public updateUser(user: User): Promise<User>{
    const url = this.getUserUrl;

    const params = new FormData();
    params.append('name', user.name);
    params.append('imageUrl', user.imageUrl)

    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      localStorage.setItem('loginUser', JSON.stringify(response.data));
      return response.data as User;
    })
    .catch(response => {
      localStorage.removeItem('x-auth-token');
      this.dialogService.alert('오류', '[회원 정보 업데이트 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 사이트에서 탈퇴한다
  public deleteUser(user: User): Promise<boolean>{
    const url = this.getUserUrl;

    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      localStorage.setItem('loginUser', JSON.stringify(response.data));
      localStorage.removeItem('x-auth-token');
      localStorage.removeItem('loginUser');
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[회원 탈퇴 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }
}
