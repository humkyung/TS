import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { User } from 'src/app/models/myinfo/User';
import { SignService } from 'src/app/service/rest-api/sign.service';
import { UserService } from 'src/app/service/rest-api/user.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';

@Component({
  selector: 'app-configuration',
  templateUrl: 'configuration.component.html',
  styleUrls: ['configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, AfterViewInit{
  public dataSource = new MatTableDataSource<License>();
  public userDataSource = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  displayedColumns: string[] =['uid', 'mac', 'email', 'app', 'count', 'code', 'delete'];
  userDisplayedColumns: string[] =['name', 'role', 'delete'];

  public loginUser: User;
  public editingUser: User;

  constructor(
    private projectService: ProjectService,
    private licenseService: LicenseService, 
    private route: ActivatedRoute,
    private signService: SignService,
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router) {
    this.dataSource.data = [];
    this.userDataSource.data = [];
    this.editingUser = null;
   }

  ngOnInit(): void {
    this.licenseService.getLicenses()
    .then(response => {
      this.dataSource.data = response;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.userService.getUsers()
    .then(response => {
      this.userDataSource.data = response;
      this.userDataSource.sort = this.sort;
      this.userDataSource.paginator = this.paginator;
    });
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

  // ????????? ??????????????? ????????????
  public generateLicense(){
    this.dialogService.generateLicense().afterClosed().subscribe(result => {
      if (result) {
        this.licenseService.generateKey(result[0], result[1], result[2], result[3], result[4])
        .then(response => {
          window.location.reload();
        });
      }
    });
  }

  public copy(){

  }

  // ????????? ?????? ????????? ????????? ??????
  public userRole(role: string): string{
    let name : string = null;
    switch(role) { 
      case "Administrator": { 
        name = "?????????";
        break; 
      } 
      case "User": { 
        name = "?????????";
        break; 
      } 
    } 

    return name;
  }

  public editing(user: User){
    this.editingUser = user;
  }

  //  ?????? ????????? ????????? ??????????????????
  public updateUsers(){
    this.userService.updateUsers(this.userDataSource.data)
    .then(response => {
    });
  }

  // ????????? ????????? ??????????????????
  public updateUser(user: User){
    this.userService.updateUser(user)
    .then(response => {
      this.editingUser = null;
    });
  }

  // ???????????? ????????????
  public deleteUser(user: User){
    this.dialogService.confirm('?????? ?????? ??????', '????????? ?????????????????????????').afterClosed().subscribe(result => {
      if(result){
        this.userService.deleteUser(user)
        .then(response => {
          this.userDataSource.data = this.userDataSource.data.filter((value,key)=>{
            return value.uid != user.uid;
          });
        });
      }
    });
  }

  // ??????????????? ????????????
  public delete(license: License){
    this.dialogService.confirm('?????? ?????? ??????', '????????? ?????????????????????????').afterClosed().subscribe(result => {
      if(result){
        this.licenseService.deleteLicense(license)
        .then(response => {
          this.dataSource.data = this.dataSource.data.filter((value,key)=>{
            return value.uid != license.uid;
          });
        });
      }
    });
  }

  // ????????? ????????? ????????????
  public getBackgroundImageUrl(){
    return "url('../../../assets/background.svg')";
  }
}