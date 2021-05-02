import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';
import { Column } from 'src/app/models/column.model';
import { Post } from 'src/app/models/board/Post';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from 'src/app/service/rest-api/board.service';
import { User } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';


@Component({
  selector: 'app-main-view',
  templateUrl: 'main-view.component.html',
  styleUrls: ['main-view.component.scss']
})

export class MainViewComponent implements OnInit {
  public posts: Post[]=[];
  displayedColumns: string[] =['uid', 'title', 'author', 'createdAt', 'status', 'modifiedAt'];
  boardName: string;
  public loginUser: User;

  constructor(
    private boardService: BoardService, 
    private route: ActivatedRoute,
    private signService: SignService,
    private myinfoService: MyinfoService,
    private dialogService: DialogService,
    private router: Router
  ){
    this.board.name = this.route.snapshot.params['boardName'];
   }

  board: Board = new Board('ATOOLS', []);

  ngOnInit(): void {
    this.boardService.getPosts(this.boardName)
    .then(response => {
      this.posts = response;
      this.posts.forEach(element => {
        const found = this.board.columns.find(col => col.name == element.status);
        if(!found){
          const col = new Column(element.status, [element]);
          this.board.columns.push(col);
        }
        else{
          found.tasks.push(element)
        }
      });
    });

    if(this.signService.isAuthenticated()){
      this.myinfoService.getUser()
      .then(user => {
        this.loginUser = user;
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  // 이미지 주소를 리턴한다
  getUrl(){
    return "url('../../../../../assets/background.svg')";
  }
}
