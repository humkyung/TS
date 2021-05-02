import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { ApiValidationService } from './common/api-validation.service';
import { Project } from 'src/app/models/board.model';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiResponseList } from 'src/app/models/common/ApiResponseList';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'
import { Member } from 'src/app/models/myinfo/User';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = environment.apiUrl + '/projects';

  constructor(
    private http: HttpClient, 
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) {

     }

  //  프로젝트 리스트 가져오기
  public getProjects(): Promise<Project[]> {
    const url = this.baseUrl + '/';
    return this.http.get<ApiResponseList>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Project[];
    })
    .catch(response => {
      this.dialogService.alert('오류', '[프로젝트 조회 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 새로운 프로젝트 생성
  newProject(data: any): Promise<Project>{
    const url = this.baseUrl + '/';
    const params = new FormData();
    params.append('title', data.title);
    params.append('description', data.description);
    params.append('picture', data.picture);
    params.append('progress', data.progress);
    return this.http.post<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Project;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[프로젝트 등록 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 프로젝트 가져오기 
  public getProject(uid: string): Promise<Project>{
    const url = this.baseUrl + '/' + uid;
    return this.http.get<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Project;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[프로젝트를 가져오는 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 프로젝트 업데이트
  public updateProject(data: any): Promise<Project>{
    const url = this.baseUrl + '/' + data.uid;
    const params = new FormData();
    params.append('title', data.title);
    params.append('description', data.description);
    params.append('picture', data.picture ? data.picture : '');
    params.append('progress', data.progress);

    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Project;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[프로젝트 업데이트 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }
  
  // 프로젝트 삭제
  deleteProject(uid: string): Promise<boolean>{
    const url = this.baseUrl + '/' + uid;
    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[프로젝트 삭제 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }
}
