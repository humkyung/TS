import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project } from "src/app/models/board.model";
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from "src/app/service/rest-api/project.service";
import { User } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';

import { Board } from 'src/app/models/board.model';
import { Column } from 'src/app/models/column.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy{
  projects: Project[];

  constructor(
    private projectService: ProjectService, 
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router) {
   }

  ngOnInit(): void {
    this.projectService.getProjects()
    .then(response => {
      this.projects = response;
    });
  }

  ngOnDestroy() {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
    // this.projectService.sortProjects(this.projects);
  }

  openProjectDialog(): void {
    let _project = {title: null, description: null, progress: 0} as Project;
    this.dialogService.createProject(_project, null, null).afterClosed().subscribe(result => {
      if (result) {
        this.projectService.newProject(result);
      }
    });
  }

  // delete(uid: string){
  //   // 게시글 삭제
  //   this.dialogService.confirm('삭제 요청 확인', '정말로 삭제하시겠습니까?').afterClosed().subscribe(result => {
  //     if(result){
  //       this.boardService.deletePost(uid)
  //       .then(response => {
  //         window.location.reload();
  //       });
  //     }
  //   });
  // }

  // 이미지 주소를 리턴한다
  public getBackgroundImageUrl(){
    return "url('../../../assets/background.svg')";
  }
}