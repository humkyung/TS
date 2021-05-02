import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberService } from 'src/app/service/rest-api/member.service'
import { DialogService } from 'src/app/service/dialog/dialog.service';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User, Member, Role } from 'src/app/models/myinfo/User';
import { UserService } from 'src/app/service/rest-api/user.service';

@Component({
  selector: 'app-member-dialog',
  templateUrl: 'member-dialog.component.html',
  styleUrls: ['member-dialog.component.css'],
})
export class MemberDialogComponent implements OnInit {
  public userDataSource = new MatTableDataSource<User>();
  public userDisplayedColumns: string[] = ['name', 'role', 'add'];

  public memberDataSource = new MatTableDataSource<Member>();
  public memberDisplayedColumns: string[] =['name', 'role', 'remove'];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredMembers: Observable<User[]>;

  public addMembersForm: FormGroup;
  file: File | null = null;
  public members: Member[] = [];
  private users: User[] = [];

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<MemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any) {
      this.members = _data[0];
      this.addMembersForm = this.formBuilder.group( 
        {
        }
      );
    }

  get f(){
    return this.addMembersForm.controls;
  }

  ngOnInit(): void {
    this.memberDataSource.data = this.members.slice();

    this.userService.getUsers()
    .then(response => {
      this.users = response;
      this.userDataSource.data = this.users;
      // set User is default
      this.userDataSource.data.forEach(user => {user.role.role = "User";});

      if(this.members){
        this.members.forEach(member => {
          this.userDataSource.data = this.userDataSource.data.filter((value,key)=>{
            return value.uid != member.user;
          });
        });
      }
    });
  }

  public supervisors(){
    return this.members.filter(member => member.role.role === 'Administrator');
  }

  // 멤버를 추가한다
  public addMember(user_: User){
    try{
      let role = {role: user_.role.role} as Role;
      let member = {uid: null, user: user_.uid , role: role} as Member;
      this.memberDataSource.data.push(member);
      this.memberDataSource._updateChangeSubscription();
      this.userDataSource.data = this.userDataSource.data.filter((value,key)=>{
        return value.uid != user_.uid;
      });
    }
    catch(e){
      this.dialogService.alert('오류', (e as Error).message);
    }
  }

  // 멤버를 삭제한다
  public removeMember(member_: Member){
    const found = this.users.find(user => user.uid == member_.user);
    if(found){
      this.userDataSource.data.push(found);
      this.userDataSource._updateChangeSubscription();
      this.memberDataSource.data = this.memberDataSource.data.filter((value,key)=>{
        return value.user!= member_.user;
      });
    }
  }

  // 멤버 이름을 되돌려준다.
  public memberName(member_uid: string){
    const found = this.users.find(user => user.uid == member_uid);
    if(found){
      return found.name;
    }

    return null;
  }

  // 보드 멤버 조건에 부합하는지 확인한다
  public isValid(): boolean{
    if(this.memberDataSource.data.length > 0){
      const administrators = this.memberDataSource.data.filter((value,key)=>{
        return value.role.role == "Administrator";
      });
      if(administrators.length > 0){
        return true;
      }
    }

    return false;
  }

  // 보드 멤버가 변경되었는지 확인한다
  public isModified(): boolean{
    if(this.members.length != this.memberDataSource.data.length){
      return true;
    }

    let missing = this.members.filter(member => this.memberDataSource.data.indexOf(member) < 0);
    if(missing.length > 0){
      return true;
    }
  }

  close(){
    this.dialogRef.close();
  }

  submit(){
  }
}
