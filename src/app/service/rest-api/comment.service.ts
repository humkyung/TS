import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ApiValidationService } from './common/api-validation.service';
import { Comment } from 'src/app/models/comment.model';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiResponseList } from 'src/app/models/common/ApiResponseList';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private getCommentUrl = environment.apiUrl + '/comment';

  constructor(
    private http: HttpClient, 
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) {

     }

  public getComments(taskUID: string): Promise<Comment[]> {
    const url = this.getCommentUrl + '/' + taskUID;
    return this.http.get<ApiResponseList>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Comment[];
    })
    .catch(response => {
      this.dialogService.alert('오류', '[댓글 조회 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 댓글 작성
  addComment(taskUID: string, content: string): Promise<Comment>{
    const url = this.getCommentUrl + '/' + taskUID;
    const params = new FormData();
    params.append('content', content);
    return this.http.post<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Comment;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[댓글 등록 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 댓글 삭제
  deleteComment(uid: number): Promise<boolean>{
    const url = this.getCommentUrl + '/' + uid;
    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[댓글 삭제 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  /// 댓글 수정
  public modifyComment(comment: Comment): Promise<Comment>{
    const url = this.getCommentUrl + '/' + comment.uid;
    const params = new FormData();
    params.append('content', comment.content);
    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Comment;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[댓글 수정 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    })
  }
}
