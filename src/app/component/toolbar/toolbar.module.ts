import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from "@angular/flex-layout";

import { SignService } from 'src/app/service/rest-api/sign.service';
import { MyinfoService } from 'src/app/service/rest-api/myinfo.service';

import { AvatarPhotoComponent } from 'src/app/avatar-photo/avatar-photo.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [
    ToolbarComponent],
  imports: [
    AppRoutingModule,
    MaterialModule,
    CommonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [ ToolbarComponent ],
  providers: [
    SignService,
    MyinfoService
  ],
})
export class ToolbarModule { }
