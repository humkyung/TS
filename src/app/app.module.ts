import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// material
import { MaterialModule } from './modules/material/material.module';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { EngineComponent } from './engine/engine.component';
import { AppBoardComponent } from './component/app.board/app.board.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SigninComponent } from './component/member/signin/signin.component';
import { SignupComponent } from './component/member/signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

// service
import { BoardService } from './service/rest-api/board.service';
import { LicenseService } from './service/rest-api/license.service';
import { ProjectService } from './service/rest-api/project.service';
import { SignService } from './service/rest-api/sign.service';
import { CommentService } from './service/rest-api/comment.service';
import { MemberService } from './service/rest-api/member.service';
import { NodeService } from './service/rest-api/node.service';
import { EngineService } from './engine/engine.service';
import { MyinfoService } from './service/rest-api/myinfo.service';
import { LoadingSpinnerService } from './service/loading-spinner/loading-spinner.service';

import { ProjectComponent } from './component/project/project.component';
import { LogoutComponent } from './component/logout/logout.component';
import { MyinfoComponent } from './component/member/myinfo/myinfo.component'
import { HttpRequestInterceptorService } from './service/rest-api/common/http-request-interceptor.service';
import { BoardComponent } from './component/board/board.component'
import { PostComponent } from './component/board/post.component';
import { PostModifyComponent } from './component/board/post-modify.component';
import { AlertDialogComponent } from './component/common/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './component/common/confirm-dialog/confirm-dialog.component';
import { BoardResolve } from './component/board/resolve/board-resolve';
import { Error404Component } from './component/common/error/error404.component';
import { MainViewComponent } from './component/pages/main-view/main-view.component';
import { HomeComponent } from './component/home.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ProjectDialogComponent } from './component/common/project-dialog/project-dialog.component';
import { LicenseDialogComponent } from './component/common/license-dialog/license-dialog.component';
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component';
import { BoardPhotoComponent } from './board-photo/board-photo.component';
import { ConfigurationComponent } from './component/configuration/configuration.component';
import { BoardConfigurationComponent } from './component/board/configuration/board.configuration.component';
import { MemberDialogComponent } from './component/board/member-dialog/member-dialog.component';

import { ToolbarModule } from './component/toolbar/toolbar.module';

import { MzdTimelineModule } from 'ngx-rend-timeline';

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    ProjectComponent,
    SigninComponent,
    SignupComponent,
    LogoutComponent,
    MyinfoComponent,
    BoardComponent,
    PostComponent,
    PostModifyComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    ProjectDialogComponent,
    LicenseDialogComponent,
    Error404Component,
    MainViewComponent,
    AvatarPhotoComponent,
    BoardPhotoComponent,
    ConfigurationComponent,
    BoardConfigurationComponent,
    MemberDialogComponent,
    AppBoardComponent,
    EngineComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    // material
    MaterialModule,
    MatListModule,
    MatSelectModule,
    MatPaginatorModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    ClipboardModule,
    // up to here
    DragDropModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OverlayModule,
    CKEditorModule,
    MzdTimelineModule,
    ToolbarModule
  ],
  exports: [
    ReactiveFormsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    AvatarPhotoComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptorService,
    multi: true
    },
    LicenseService,
    ProjectService,
    SignService,
    MyinfoService,
    BoardService,
    CommentService,
    BoardResolve,
    MemberService,
    LoadingSpinnerService,
    NodeService,
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    EngineService
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    ProjectDialogComponent,
    LicenseDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
