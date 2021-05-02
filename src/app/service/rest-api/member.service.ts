import { Injectable } from '@angular/core';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiValidationService } from './common/api-validation.service'
import { Member } from 'src/app/models/myinfo/User';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private getMemberUrl = environment.apiUrl + '/member';

  constructor(private http: HttpClient,
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) { }

  public getMembers(board_uid: string): Promise<Member[]>{
    const url = this.getMemberUrl + '/' + board_uid;
    return this.http.get<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Member[];
    })
    .catch(response => {
      this.dialogService.alert('오류', '[보드 구성원 정보 조회 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 보드 구성원을 갱신한다
  public updateMembers(board_uid: string, members: Member[]): Promise<boolean>{
    const params = new FormData();
    let users = [];
    let roles = [];
    members.forEach(member => {
      users.push(member.user);
      roles.push(member.role.role);
    });
    params.append('users', users.toString());
    params.append('roles', roles.toString());

    const url = this.getMemberUrl + '/' + board_uid;
    return this.http.post<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[보드 구성원 정보 갱신 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 보드 구성원 정보를 갱신한다
  public updateMember(member: Member): Promise<boolean>{
    const params = new FormData();
    params.append('role', member.role.role);

    const url = this.getMemberUrl.concat('/' + member.uid.toString());
    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[보드 구성원 정보 갱신 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 보드 구성원을 제거한다
  public removeMember(member_uid: number): Promise<boolean>{
    const url = this.getMemberUrl.concat('/' + member_uid.toString());
    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[보드 구성원 삭제 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }
}
