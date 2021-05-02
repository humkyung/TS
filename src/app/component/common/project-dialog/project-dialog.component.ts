import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberService } from 'src/app/service/rest-api/member.service'
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from 'src/app/models/myinfo/User';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: 'project-dialog.component.html',
  styleUrls: ['project-dialog.component.css'],
})
export class ProjectDialogComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput;
  @ViewChild('supervisorInput') supervisorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredMembers: Observable<User[]>;

  public newProjectForm: FormGroup;
  public isNewProject: boolean;
  public data: any;
  file: File | null = null;
  public members: User[] = [];
  allUsers: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any) {
      this.data = _data[0];
      this.allUsers = _data[1];
      if(_data[2]){
        _data[2].forEach(member => {
          const found = this.allUsers.find(user => user.uid === member.user);
          if(found){
            this.members.push(found)
            const index = this.allUsers.indexOf(found);
            if(index != -1){
              this.allUsers.splice(index, 1);
            }
          }
        });
      }
      this.isNewProject = (this.data.title == null);

      this.newProjectForm = this.formBuilder.group(
        {
          title: new FormControl('', [Validators.required]),
          description: new FormControl('', []),
          imageFile: new FormControl('', []),
          progress: new FormControl(0, [Validators.max(100), Validators.min(0)]),
          supervisorCtrl: new FormControl('', [])
        }
      );

      this.filteredMembers = this.newProjectForm.controls.supervisorCtrl.valueChanges.pipe(
        map((member: User | null) => member ? this._filter(member) : this.allUsers.slice()));

      this.newProjectForm.controls.supervisorCtrl.setValue(null);
  }

  get f(){
    return this.newProjectForm.controls;
  }

  ngOnInit(): void {
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  preview(file) {
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();
    reader.readAsDataURL(this.file); 
    reader.onload = (_event) => { 
      this.data.picture = reader.result; 
    }
  }

  public supervisors(){
    return this.members.filter(member => member.role.role === 'Administrator');
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add member
    if ((value || '').trim()) {
      const found = this.allUsers.find(member => member.uid === value);
      if(found){
        found.role.role = "Administrator";
        this.members.push(found);

        const index = this.allUsers.indexOf(found);
        if(index != -1){
          this.allUsers.splice(index, 1);
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.newProjectForm.controls.supervisorCtrl.setValue(null);
  }

  remove(member: User): void {
    const index = this.members.indexOf(member);

    if (index >= 0) {
      this.members.splice(index, 1);
      this.allUsers.push(member);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const found = this.allUsers.find(member => member.uid === event.option.viewValue);
    if(found){
      found.role.role = "Administrator";
      this.members.push(found);
      const index = this.allUsers.findIndex(user => user.uid === found.uid);
      if(index != -1){
        this.allUsers.splice(index, 1);
      }
      this.supervisorInput.nativeElement.value = '';
      this.newProjectForm.controls.supervisorCtrl.setValue(null);
    }
  }

  private _filter(value: User): User[] {
    if (typeof value != "string"){
      const filterValue = value.uid.toLowerCase();

      return this.allUsers.filter(member => member.uid.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  close(){
    this.dialogRef.close();
  }

  submit(){
  }
}
