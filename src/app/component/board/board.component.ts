import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Post } from 'src/app/models/board/Post';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/service/rest-api/project.service';
import { BoardService } from 'src/app/service/rest-api/board.service';
import { User } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';

import { Board, Project } from 'src/app/models/board.model';
import { Column } from 'src/app/models/column.model';

@Component({
  selector: 'app-board',
  templateUrl: 'board.component.html',
  styleUrls: ['board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit{
  public dataSource = new MatTableDataSource<Post>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  displayedColumns: string[] =['title', 'priority', 'author', 'createdAt', 'startDate', 'dueDate', 'status', 'modifiedAt'];
  priorityColumns = {0: '높음', 1: '보통', 2: '낮음'};
  public board_uid: string;
  public project: Project;
  public loginUser: User;

  public board: Board;

  constructor(
    private projectService: ProjectService,
    private boardService: BoardService, 
    private route: ActivatedRoute,
    private signService: SignService,
    private myinfoService: MyinfoService,
    private dialogService: DialogService,
    private router: Router) {
    this.board_uid = this.route.snapshot.params['boardName'];
    this.dataSource.data = [];
    this.board = new Board('', []);
   }

  ngOnInit(): void {
    this.projectService.getProject(this.board_uid)
    .then(response => {
      this.project = response;
    });

    this.boardService.getPosts(this.board_uid)
    .then(response => {
      this.dataSource.data = response;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      // 칸반 보드 준비
      this.dataSource.data.forEach(element => {
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public doFilter(value: string){
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public isSupervisor(){
    return true;
  }

  delete(uid: string){
    // 게시글 삭제
    this.dialogService.confirm('삭제 요청 확인', '정말로 삭제하시겠습니까?').afterClosed().subscribe(result => {
      if(result){
        this.boardService.deletePost(uid)
        .then(response => {
          this.dataSource.data = this.dataSource.data.filter((value,key)=>{
            return value.uid != uid;
          });

          this.board.columns.forEach(column => {
            const found = column.tasks.findIndex(task => task.uid == uid);
            if(!found)
            {
              column.tasks.splice(found, 1)
            }
          });
        });
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      const status = event.container.element.nativeElement.parentNode.childNodes[0].textContent.trim();
      event.container.data[event.currentIndex]['status'] = status;

      // 일감의 상태를 변경한다
      let post:Post = (event.container.data[event.currentIndex] as unknown) as Post;
      this.boardService.modifyPost(post)
      .catch(respose => {this.dialogService.alert("오류", "상태 변경에 실패했습니다 - " + respose.msg);});
    }
  }

  // 이미지 주소를 리턴한다
  public getBackgroundImageUrl(){
    return "url('../../../assets/background.svg')";
  }
}