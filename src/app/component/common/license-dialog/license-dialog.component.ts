import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LicenseService } from 'src/app/service/rest-api/license.service';
import { DialogService } from 'src/app/service/dialog/dialog.service';

@Component({
  selector: 'app-license-dialog',
  templateUrl: 'license-dialog.component.html',
  styleUrls: ['license-dialog.component.css']
})
export class LicenseDialogComponent implements OnInit {
  public licenseForm: FormGroup;
  public macAddress: string;
  public api: string;
  public email: string;
  public dateRange: number;
  public selectedOption: number;
  public app: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LicenseDialogComponent>){
      this.licenseForm = this.formBuilder.group(
        {
          macAddress: new FormControl('', [Validators.required]),
          api: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required, Validators.email]), 
          dateRange: new FormControl('', [Validators.required]),
          dateOption: new FormControl('', [Validators.required]),
          app: new FormControl('', [Validators.required])
        }
      );

      this.macAddress = null;
      this.api = null;
      this.dateRange = 1;
      this.selectedOption = 1;
      this.app = null;
  }

  get f(){
    return this.licenseForm.controls;
  }

  ngOnInit(): void {
  }

  submit(){
  }

  close(){
    this.dialogRef.close();
  }
}