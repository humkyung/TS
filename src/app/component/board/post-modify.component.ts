import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/board/Post';
import { FormGroup, FormBuilder, ValidatorFn, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BoardService } from 'src/app/service/rest-api/board.service';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { User } from 'src/app/models/myinfo/User';
import { Comment } from 'src/app/models/comment.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommentService } from 'src/app/service/rest-api/comment.service';
import { ThemeService } from 'src/app/service/theme.service';


// 시작 날짜와 완료 날짜를 비교한다.
const DateRangeValidator: ValidatorFn = (fg: FormGroup) => {
  const start = fg.get('startDate').value;
  const end = fg.get('dueDate').value;
  return start !== null && end !== null && start <= end ? null : { range: true };
};

@Component({
  selector: 'app-post-modify',
  templateUrl: 'post-modify.component.html',
  styleUrls: ['post-modify.component.css']
})
export class PostModifyComponent implements OnInit {
  public loginUser: User;
  public board_uid: string;
  public boardName: string;
  public uid: number;
  public post = {} as Post;
  public postForm: FormGroup;
  public statusList: string[] =["To Do", "In Progress", "Done"];
  public priorityList = [{"number": 0, "value":"높음"}, {"number":1, "value":"보통"}, {"number":2, "value":"낮음"}];
  public Editor = ClassicEditor;
  public comments: Comment[];
  public comment: any;
  alternateSide: boolean = true;
  firstContentSide: 'left' | 'right' = 'left';
  editorConfig = {
    placeholder: '여기에 입력하세요',
    toolbar: []
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private signService: SignService,
    private myinfoService: MyinfoService,
    private commentService: CommentService, 
    private formBuilder: FormBuilder,
    private _location: Location
  ) {
    this.board_uid = this.route.snapshot.params['boardName'];
    this.boardName = this.route.snapshot.params['title'];
    this.uid = this.route.snapshot.params['uid'];
    this.postForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      selectPriority: new FormControl('', [Validators.required]),
      startDate: new FormControl(''),
      dueDate: new FormControl(''),
      selectStatus: new FormControl('', [Validators.required])
    }, {validator: DateRangeValidator});

    if(this.signService.isAuthenticated()){
      this.myinfoService.getUser()
      .then(user => {
        this.loginUser = user;
      });
    }

    this.comment = "";
   }

  ngOnInit(): void {
    this.boardService.viewPost(this.uid)
    .then(post => {
      this.post = post;
      if(this.post.startDate){
        this.post.startDate = new Date(this.post.startDate)
      }
      if(this.post.dueDate){
        this.post.dueDate = new Date(this.post.dueDate)
      }

      this.commentService.getComments(this.post.uid)
      .then(response => {
        this.comments = response;
      });
    });
  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  get f(){ return this.postForm.controls; }

  public canEdit(){
    return (this.post && this.loginUser.uid===this.post.user.uid);
  }

  public newComment(){
    this.commentService.addComment(this.post.uid, this.comment)
    .then(response => {
      this.comment = "";
      this.comments.push(response);
    });
  }

  public deleteComment(comment_uid: number){
    this.commentService.deleteComment(comment_uid)
    .then(response => {
      const found = this.comments.findIndex(comment => comment.uid == comment_uid);
      if(found != -1)
      {
        this.comments.splice(found, 1)
      }
    });
  }

  public getEditorConfig(comment: boolean){
    if(comment){
      return {
        placeholder: '여기에 입력하세요',
        toolbar: []
      };
    }else{
      return {
        placeholder: '여기에 입력하세요'
      };
    }
  }

  submit(){
    this.boardService.modifyPost(this.post)
    .then(response => {
      this.router.navigate(['/board/' + this.board_uid, {'title': this.boardName}]);
    });
  }

  // 이전 페이지로 되돌아가기
  public cancel(){
    this._location.back();
  }
}

class UploadAdapter {
  private loader;

   constructor( loader ) {
      this.loader = loader;
   }

   upload() {
      return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                  var myReader= new FileReader();
                  myReader.onloadend = (e) => {
                     resolve({ default: myReader.result });
                  }

                  myReader.readAsDataURL(file);
            } ) );
   };
}
