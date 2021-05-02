import { Injectable } from '@angular/core';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiValidationService } from './common/api-validation.service'
import { Node } from 'src/app/models/node.model';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private nodeUrl = environment.apiUrl + '/node';

  constructor(private http: HttpClient,
    private apiValidationService: ApiValidationService) { }

    // 모든 노드들을 가져온다
  public getNodes(): Promise<Node[]>{
    const url = this.nodeUrl;
    return this.http.get<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Node[];
    })
    .catch(response => {
      return Promise.reject(response.msg);
    });
  }
}