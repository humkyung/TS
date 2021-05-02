import { Injectable } from '@angular/core';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiValidationService } from './common/api-validation.service'
import { License } from 'src/app/models/license.model';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  private getLicenseUrl = environment.apiUrl + '/license';

  constructor(private http: HttpClient,
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) { }

    // 모든 라이센스를 조회한다
  public getLicenses(): Promise<License[]>{
    const url = this.getLicenseUrl;
    return this.http.get<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as License[];
    })
    .catch(response => {
      this.dialogService.alert('오류', '[라이센스 정보 조회 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 라이센스 키를 생성한다
  public generateKey(mac:string, api: string, email:string, expirationDate: number, app: string): Promise<string>{
    const url = this.getLicenseUrl;

    const params = new FormData();
    params.append('mac', mac);
    params.append('api', api);
    params.append('email', email);
    params.append('expiration date', expirationDate.toString());
    params.append('app', app);

    return this.http.post<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as string;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[라이센스 키 생성 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 라이센스를 삭제한다
  public deleteLicense(license: License): Promise<boolean>{
    const url = this.getLicenseUrl + '/' + license.uid.toString();

    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[라이센스 삭제 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }
}
