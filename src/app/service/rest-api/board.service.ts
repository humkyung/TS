import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ApiValidationService } from './common/api-validation.service';
import { Post } from 'src/app/models/board/Post';
import { ApiResponseSingle } from 'src/app/models/common/ApiResponseSingle';
import { ApiResponseList } from 'src/app/models/common/ApiResponseList';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private getBoardUrl = environment.apiUrl + '/board';

  constructor(
    private http: HttpClient, 
    private apiValidationService: ApiValidationService,
    private dialogService: DialogService) {

     }

  public getPosts(boardName: string): Promise<Post[]> {
    const url = this.getBoardUrl + '/' + boardName + '/posts';
    return this.http.get<ApiResponseList>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Post[];
    })
    .catch(response => {
      this.dialogService.alert('오류', '[게시판 조회 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 게시글 작성
  addPost(boardName: string, author: string, title: string, content: string, startDate: Date, dueDate: Date, status: string, priority: number): Promise<Post>{
    const url = this.getBoardUrl + '/' + boardName + '/post';
    const params = new FormData();
    params.append('author', author);
    params.append('title', title);
    params.append('content', content);
    var datePipe = new DatePipe("en-US");
    const startDate_ = datePipe.transform(startDate, 'yyyy-MM-dd HH:mm:ss');
    params.append('startDate', startDate_);
    const dueDate_ = datePipe.transform(dueDate, 'yyyy-MM-dd HH:mm:ss');
    params.append('dueDate', dueDate_);
    params.append('status', status);
    params.append('priority', priority.toString());
    return this.http.post<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Post;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[게시판 등록 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  // 게시글 상세 내용 조회
  viewPost(uid: number): Promise<Post>{
    const url = this.getBoardUrl + '/post/' + uid;
    return this.http.get<ApiResponseSingle>(url)
      .toPromise()
      .then(this.apiValidationService.validateResponse)
      .then(response => {
        return response.data as Post;
      })
      .catch(response => {
        this.dialogService.alert('오류', '[게시글 조회 중 오류 발생]\n' + response.msg);
        return Promise.reject(response.msg);
      });
  }

  // 게시글 삭제
  deletePost(uid: string): Promise<boolean>{
    const url = this.getBoardUrl + '/post/' + uid;
    return this.http.delete<ApiResponseSingle>(url)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return true;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[게시글 삭제 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    });
  }

  /// 게시글 수정
  public modifyPost(post: Post): Promise<Post>{
    const url = this.getBoardUrl + '/post/' + post.uid;
    const params = new FormData();
    params.append('author', post.author);
    params.append('title', post.title);
    if(post.content)
    {
      params.append('content', post.content);
    }
    params.append('priority', post.priority.toString());
    var datePipe = new DatePipe("en-US");
    const startDate = datePipe.transform(post.startDate, 'yyyy-MM-dd HH:mm:ss');
    params.append('startDate', startDate);
    const dueDate = datePipe.transform(post.dueDate, 'yyyy-MM-dd HH:mm:ss');
    params.append('dueDate', dueDate);
    params.append('status', post.status);
    return this.http.put<ApiResponseSingle>(url, params)
    .toPromise()
    .then(this.apiValidationService.validateResponse)
    .then(response => {
      return response.data as Post;
    })
    .catch(response => {
      this.dialogService.alert('오류', '[게시글 수정 중 오류 발생]\n' + response.msg);
      return Promise.reject(response.msg);
    })
  }
}
