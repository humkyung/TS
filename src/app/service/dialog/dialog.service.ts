import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { AlertDialogComponent } from 'src/app/component/common/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from 'src/app/component/common/confirm-dialog/confirm-dialog.component';
import { ProjectDialogComponent } from 'src/app/component/common/project-dialog/project-dialog.component';
import { LicenseDialogComponent } from "src/app/component/common/license-dialog/license-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog) { }

  alert(title: string, desc: string): any{
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {title: title, description: desc}
    });

    return dialogRef;
  }

  confirm(title: string, desc: string): any{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {title: title, description: desc}
    });

    return dialogRef;
  }

  // create a project
  public createProject(project: any, users: any, members: any){
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      disableClose: true,
      data: [project, users, members]
    });

    return dialogRef;
  }
  
  public generateLicense(){
    const dialogRef = this.dialog.open(LicenseDialogComponent, {
      width: '800px',
      disableClose: true
    });

    return dialogRef;
  }
}
