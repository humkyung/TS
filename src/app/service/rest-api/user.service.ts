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
export class UserService {
  private userUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient,
    private apiValidationService: ApiValidationService) { }

  public getUsers(): Promise<User[]>{
    const url = this.userUrl.concat('/all');
    return this.http.get<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as User[];
    })
    .catch(response => {
      return Promise.reject(response.msg);
    });
  }

  // 사용자 정보를 갱신한다
  public updateUsers(users: User[]): Promise<boolean>{
    const params = new FormData();
    let uids = [];
    let roles = [];
    users.forEach(user=> {
      uids.push(user.uid);
      roles.push(user.role.role);
    });
    params.append('users', uids.toString());
    params.append('roles', roles.toString());

    const url = this.userUrl.concat('/all');
    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      return Promise.reject(response.msg);
    });
  }

  // 사용자 정보를 갱신한다
  public updateUser(user: User): Promise<boolean>{
    const params = new FormData();
    params.append('user', user.uid);
    params.append('role', user.role.role);

    const url = this.userUrl.concat('/role');
    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      return Promise.reject(response.msg);
    });
  }

  // 사용자를 삭제한다 
  public deleteUser(user: User): Promise<boolean>{
    const url = this.userUrl.concat('/' + user.uid);
    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      return Promise.reject(response.msg);
    });
  }
}