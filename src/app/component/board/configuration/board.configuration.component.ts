import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { License } from 'src/app/models/license.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/service/rest-api/project.service';
import { LicenseService } from 'src/app/service/rest-api/license.service';
import { User, Member } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { MemberService } from 'src/app/service/rest-api/member.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';
import { MemberDialogComponent } from '../member-dialog/member-dialog.component';

@Component({
  selector: 'app-board-configuration',
  templateUrl: 'board.configuration.component.html',
  styleUrls: ['board.configuration.component.scss']
})
export class BoardConfigurationComponent implements OnInit, AfterViewInit{
  public memberDataSource = new MatTableDataSource<Member>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  memberDisplayedColumns: string[] =['name', 'role', 'delete'];

  @Input()
  public board_uid: string;

  public loginUser: User;
  public editingMember: Member;

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private licenseService: LicenseService, 
    private route: ActivatedRoute,
    private signService: SignService,
    private memberService: MemberService,
    private dialogService: DialogService,
    private router: Router) {
    this.memberDataSource.data = [];
    this.editingMember = null;
   }

  ngOnInit(): void {
    this.memberService.getMembers(this.board_uid)
    .then(response => {
      this.memberDataSource.data = response;
      this.memberDataSource.sort = this.sort;
      this.memberDataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    this.memberDataSource.sort = this.sort;
  }

  public doFilter(value: string){
    this.memberDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public isSupervisor(){
    return true;
  }

  public copy(){

  }

  // 멤버 역활 이름을 되돌려 준다
  public memberRole(role: string): string{
    let name : string = null;
    switch(role) { 
      case "Administrator": { 
        name = "관리자";
        break; 
      } 
      case "User": { 
        name = "사용자";
        break; 
      } 
      default: { 
        name = "관람자";
        //statements; 
        break; 
    } 
  }

  return name;
}

  public editing(member: Member){
    this.editingMember = member;
  }

  // 구성원을 추가한다
  public addMembers(){
    const members =this.memberDataSource.data.slice();
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '50%',
      disableClose: true,
      data: [members]
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.memberService.updateMembers(this.board_uid, result)
        .then(response => {
          this.memberService.getMembers(this.board_uid)
          .then(response => {
            this.memberDataSource.data = response;
          });
        });
      };
    });
  }

  // 보드 구성원 정보를 업데이트한다
  public updateMembers(){
    this.memberService.updateMembers(this.board_uid, this.memberDataSource.data)
    .then(response => {
      this.memberService.getMembers(this.board_uid)
      .then(response => {
        this.memberDataSource.data = response;
      });
    });
  }

  // 보드 구성원 정보를 업데이트한다
  public updateMember(member: Member){
    this.memberService.updateMember(member)
    .then(response => {
      this.editingMember = null;
    });
  }

  // 보드 구성원을 삭제한다
  public removeMember(member: Member){
    this.dialogService.confirm('삭제 요청 확인', '정말로 삭제하시겠습니까?').afterClosed().subscribe(result => {
      if(result){
        this.memberService.removeMember(member.uid)
        .then(response => {
          this.memberDataSource.data = this.memberDataSource.data.filter((value,key)=>{
            return value.uid != member.uid;
          });
        });
      }
    });
  }

  // 이미지 주소를 리턴한다
  public getBackgroundImageUrl(){
    return "url('../../../assets/background.svg')";
  }
}