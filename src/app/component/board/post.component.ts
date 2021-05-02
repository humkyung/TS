import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { BoardService } from 'src/app/service/rest-api/board.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const DateRangeValidator: ValidatorFn = (fg: FormGroup) => {
  const start = fg.get('startDate').value;
  const end = fg.get('dueDate').value;
  return start !== null && end !== null && start <= end ? null : { range: true };
};

@Component({
  selector: 'app-post',
  templateUrl: 'post.component.html',
  styleUrls: ['post.component.css']
})
export class PostComponent implements OnInit {
  private board_uid: string;
  public boardName: string;
  public status: string;
  public priority: number;
  public startDate: Date;
  public dueDate: Date;
  public postForm: FormGroup;
  public statusList: string[] =["To Do", "In Progress", "Done"];
  public priorityList = {0: "높음", 1: "보통", 2: "낮음"};
  public Editor = ClassicEditor;
  editorConfig = {
    placeholder: 'Type the content here!',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private signService: SignService,
    private myinfoService: MyinfoService,
    private boardService: BoardService) {
      this.postForm = this.formBuilder.group({
        title: new FormControl('', [Validators.required]),
        content: new FormControl('', [Validators.required]),
        selectPriority: new FormControl('', [Validators.required]),
        startDate: new FormControl(''),
        dueDate: new FormControl(''),
        selectStatus: new FormControl('', [Validators.required])
      }, {validator: DateRangeValidator});
      this.board_uid = this.route.snapshot.params['boardName'];
      this.status = this.route.snapshot.params['status'];
     }

  ngOnInit(): void {
  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  get f(){
    return this.postForm.controls;
  }

  submit(){
    if(this.signService.isAuthenticated() && this.postForm.valid){
      this.myinfoService.getUser().then(user => {
        this.boardService.addPost(this.board_uid, user.uid, this.postForm.value.title,
          this.postForm.value.content, this.startDate, this.dueDate, this.status, this.priority)
          .then(response => {
            this.router.navigate(['/board/' + this.board_uid]);
          });
      });
    }
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