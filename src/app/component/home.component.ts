import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

import { User } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service'
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';
import { Project } from "src/app/models/board.model";
import { ProjectService } from "src/app/service/rest-api/project.service";
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { MemberService } from '../service/rest-api/member.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  public loginUser: User;
  projects: Project[];

  constructor(
    public signService: SignService,
    private myinfoService: MyinfoService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private dialogService: DialogService,
    private router: Router
  ) {
    if(this.signService.isAuthenticated()){
        this.myinfoService.getUser()
        .then(user => {
          this.loginUser = user;
        });
      }
  }

  ngOnInit(): void {
    this.projectService.getProjects()
    .then(response => {
      this.projects = response;
    });
  }

  public canCreateBoard(): boolean{
    return (this.loginUser && this.loginUser.role && this.loginUser.role.role === 'Administrator');
  }

  openProjectDialog(project?: Project): void {
    if(project == null){
      this.myinfoService.getAllUsers()
      .then(response => {
        const users = response;
        let _project = {title: null, description: null, progress: 0} as Project;
        this.dialogService.createProject(_project, users, null).afterClosed().subscribe(result => {
          if (result) {
            this.projectService.newProject(result).
            then(response => {
              window.location.reload();
              });
          }
        });
      });
    }
    else{
      this.myinfoService.getAllUsers()
      .then(response => {
        const users = response;
        this.memberService.getMembers(project.uid)
        .then(response => {
          const members = response;
          this.dialogService.createProject(project, users, members).afterClosed().subscribe(result => {
            if (result) {
              this.projectService.updateProject(result[0])
              .then(response => {
                this.memberService.updateMembers(result[0].uid, result[1])
                .then(response => {
                  window.location.reload();
                });
              });
            }
          });
        });
      });
    }
  }

  // 프로젝트 삭제
  public deleteProject(uid: string){
    this.dialogService.confirm('삭제 요청 확인', '정말로 삭제하시겠습니까?').afterClosed().subscribe(result => {
      if(result){
        this.projectService.deleteProject(uid)
        .then(response => {
          window.location.reload();
        });
      }
    });
  }

  getUrl(){
    return "url('../assets/background.svg')";
  }
}
